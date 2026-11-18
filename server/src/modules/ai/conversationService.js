/**
 * SANAD AI Assistant - Conversation Service
 * Manages mode-aware multi-turn conversations in:
 * - Mode A: General Conversation (natural, friendly, no unrequested legal lecturing)
 * - Mode B: Legal Information (grounded in Moroccan law, citations, practical advice)
 * - Mode C: Safety & Emergency (empathy, safety first, no victim blaming, Moroccan hotlines 19 / 177 / 15)
 *
 * Supports: Moroccan Darija (Arabic script), Arabizi (Latin script), Arabic, French.
 */

const { LANGUAGES } = require('./languageService');
const { findBestKnowledgeMatch } = require('./legalRagService');

// Mode Prompts
const SYSTEM_PROMPTS = {
  MODE_A: `Tu es SANAD AI (سند), une assistante conversationnelle marocaine bienveillante, intelligente, amicale et naturelle intégrée dans l'application SANAD.
PRIORITÉ ABSOLUE À LA DARIJA MAROCAINE ET AU TON NATUREL :
1. Comporte-toi comme une amie bienveillante ou une grande soeur marocaine compréhensive, pas comme un robot ou un serveur FAQ.
2. Si l'utilisatrice écrit en Arabizi (Darija en lettres latines avec chiffres 3, 7, 9, 5) : réponds en pur Arabizi marocain naturel (ex: "Wa 3laykom salam! Labas lhamdullah, rbi ykhellik. W nti labas 3lik? Marhba bik f SANAD, fch n9der n3awnk lyoum?").
3. Si elle écrit en Darija en caractères arabes : réponds en Darija marocaine authentique et chaleureuse (ex: "وعليكم السلام ورحمة الله! مرحبا بك فأي وقت، يسول فيك الخير، كيدايرة ولاباس عليك؟").
4. Si l'utilisatrice dit bonjour ou demande à poser une question ("Bghit nsawlk 3la chi haja") : accueille-la simplement et chaleureusement sans jamais forcer de sujet juridique ni faire la morale.
5. Ne transforme JAMAIS une simple salutation en exposé de lois ou en cours de droit.
6. Adapte parfaitement ta langue : Darija (arabe ou arabizi), Français, ou Arabe classique.`,

  MODE_B: `Tu es SANAD AI (سند), conseillère juridique spécialisée dans le droit marocain et la protection des femmes au Maroc.
RÈGLES D'INFORMATION JURIDIQUE EN DARIJA & LANGUES NATIONALES :
1. Fonde tes réponses sur les lois marocaines réelles : Loi 103-13 relative à la lutte contre les violences faites aux femmes, Code Pénal marocain (notamment art. 447-1, 503-1-1), Moudawana (Code de la Famille), Code du Travail marocain.
2. Explique le droit en langage clair, simple et accessible, particulièrement en Darija et Arabizi, sans noyer la personne dans le jargon technique.
3. Donne les démarches pratiques pas à pas (1. Se mettre en sécurité / 2. Certificat médical avec ITT si violences / 3. Dépôt de plainte auprès de la cellule spécialisée au Tribunal de Première Instance ou au commissariat).
4. Cite les sources vérifiées (Portail Adala justice.gov.ma, CNDH).
5. Mentionne avec bienveillance que ces informations sont indicatives et oriente vers les associations d'écoute et avocats partenaires.`,

  MODE_C: `Tu es SANAD AI (سند) en MODE URGENCE ET PROTECTION. L'utilisatrice fait face à une menace, violence, détresse ou danger immédiat.
RÈGLES ABSOLUES DE SÉCURITÉ ET D'EMPATHIE :
1. Fais preuve d'une empathie totale, d'une douceur absolue et d'aucun jugement. Ne blâme JAMAIS la victime.
2. Ne pousse JAMAIS l'utilisatrice à affronter l'agresseur ou à se mettre en danger.
3. Donne immédiatement et clairement les numéros d'urgence gratuits au Maroc :
   - 19 : Police Secours (en ville)
   - 177 : Gendarmerie Royale (hors agglomération / milieu rural)
   - 15 : Protection Civile (Ambulance / Urgence vitale)
4. Conseille la mise en sécurité immédiate (quitter les lieux, aller chez un proche sûr ou au commissariat le plus proche).
5. Réponds dans la langue de l'utilisatrice (Darija, Arabizi, Arabe, Français).`
};

/**
 * Builds the prompt messages array for Gemini / LLM
 */
function buildMessages(mode, history = [], currentMessage, context = {}) {
  const systemInstruction = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.MODE_A;

  let legalContextText = '';
  if (mode === 'MODE_B' && context.legalSources && context.legalSources.length > 0) {
    legalContextText = '\n\nDOCUMENTS JURIDIQUES OFFICIELS DE RÉFÉRENCE :\n' +
      context.legalSources.map(s => `- [${s.code || ''}] ${s.article || ''} : ${s.title || ''}\n  Résumé: ${s.summary || ''}\n  Source officielle: ${s.officialSource || ''}`).join('\n');
  }

  const promptContents = [];

  // Add previous turns
  if (Array.isArray(history) && history.length > 0) {
    // Keep last 6 messages to stay fast and focused
    const recent = history.slice(-6);
    for (const msg of recent) {
      if (msg.text || msg.content) {
        promptContents.push({
          role: msg.sender === 'user' || msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content }]
        });
      }
    }
  }

  // Add current user prompt with instructions and context
  const fullUserPrompt = `${currentMessage}${legalContextText}`;
  promptContents.push({
    role: 'user',
    parts: [{ text: fullUserPrompt }]
  });

  return { systemInstruction, contents: promptContents };
}

/**
 * Generates response using Gemini API with resilient fallbacks
 */
async function generateAiResponse({ mode, language, message, history = [], context = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const lang = (language && language.code) ? language.code : (language || 'fr');

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const { systemInstruction, contents } = buildMessages(mode, history, message, context);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      // Preferred model from env or standard flash models
      const modelsToTry = [
        process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-flash-latest'
      ];

      for (const model of modelsToTry) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemInstruction }]
              },
              generationConfig: {
                temperature: mode === 'MODE_A' ? 0.7 : 0.2,
                maxOutputTokens: 650
              }
            }),
            signal: controller.signal
          });

          if (res.ok) {
            clearTimeout(timeout);
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 0) {
              return {
                text: text.trim(),
                model,
                mode,
                language: lang
              };
            }
          }
        } catch (innerErr) {
          // try next model
        }
      }
      clearTimeout(timeout);
    } catch (e) {
      // fallback to high-quality curated responses
    }
  }

  // Curated Native Multilingual Fallbacks (Tested & Verified)
  const curatedText = getCuratedResponse(mode, lang, message, context);
  return {
    text: curatedText,
    model: 'sanad-curated-expert',
    mode,
    language: lang
  };
}

/**
 * Provides immediate, accurate native responses for test environments or offline state
 */
function getCuratedResponse(mode, lang, message, context = {}) {
  const lower = (message || '').toLowerCase().trim();

  // ── 0. FIRST CHECK KNOWLEDGE BASE FOR SUBSTANTIVE QUESTIONS ──
  // Check if it's NOT a mere short greeting before searching the 100 Q&A base
  const isGreeting = /^(salam|slm|bonjour|salut|coucou|hello|labas|ca va|kidayr|kidayra|merci|chokran|choukrane|السلام|مرحبا|شكرا)[\s!.]*$/i.test(lower);

  if (!isGreeting && mode !== 'MODE_C') {
    const kbMatch = findBestKnowledgeMatch(message, lang);
    if (kbMatch && kbMatch.score >= 8) {
      let resp = kbMatch.localizedAnswer;
      if (kbMatch.legalReference && !resp.includes(kbMatch.legalReference)) {
        if (lang === 'arabizi') {
          resp += `\n\n📌 L-marji3 l9anouni: ${kbMatch.legalReference} (${kbMatch.source})`;
        } else if (lang === 'darija' || lang === 'arabic') {
          resp += `\n\n📌 المرجع القانوني: ${kbMatch.legalReference} (${kbMatch.source})`;
        } else {
          resp += `\n\n📌 Référence légale : ${kbMatch.legalReference} (${kbMatch.source})`;
        }
      }
      return resp;
    }
  }

  // ── MODE A: GENERAL CONVERSATION ──
  if (mode === 'MODE_A') {
    if (lang === 'arabizi') {
      if (lower.includes('salam') || lower.includes('slm')) {
        return 'Wa 3laykom salam! Labas lhamdullah, rbi ykhellik. W nti labas 3lik? Merhba bik f SANAD, fch n9der n3awnk lyoum?';
      }
      if (lower.includes('bghit nsawlk') || lower.includes('bghit nswl') || lower.includes('soual') || lower.includes('chi haja')) {
        return 'Merhba bik f ay we9t! Swlini 3la li bghiti w rani m3ak bach nsm3k w nchar7 lik kolchi b wadaha.';
      }
      if (lower.includes('labas') || lower.includes('ca va') || lower.includes('kidayr')) {
        return 'Lhamdullah, rbi ykhellik! Kolchi bikhir, nti labas 3lik w kidayra sa7a?';
      }
      if (lower.includes('chkon nti') || lower.includes('chkatdiri') || lower.includes('sanad')) {
        return "Ana SANAD, l'moussa3ida dkiya dyalk. Hna bach nti9o f ba3diyatna, nhdro f ay mawdou3 w n3awnk b ma3loumat mowatta9a f ay we9t.";
      }
      if (lower.includes('chokran') || lower.includes('merci')) {
        return 'La chokr 3la wajib! Rbi ykhellik, marhba bik f ay we9t.';
      }
      return 'Ahlan bik! Rani m3ak w kan-sm3k b kol lfarah. Golia kif n9der n3awnk lyoum?';
    }

    if (lang === 'darija') {
      if (lower.includes('salam') || lower.includes('السلام')) {
        return 'وعليكم السلام ورحمة الله! مرحبا بك فسند. يسول فيك الخير، كيف دايرة ولاباس عليك؟ كاين شي حاجة نقدر نعاونك بيها؟';
      }
      if (lower.includes('نسولك') || lower.includes('سؤال') || lower.includes('شي حاجة')) {
        return 'مرحبا بك فأي وقت! سولي على أي حاجة بغيتي، راني هنا باش نسمعك ونعاونك بكل وضوح ورحابة صدر.';
      }
      if (lower.includes('labas') || lower.includes('kidayra') || lower.includes('لاباس') || lower.includes('كيدايرة')) {
        return 'الحمد لله، ربي يخليك! كلشي بخير، نتي لاباس عليك وصحتك مزيانة؟';
      }
      if (lower.includes('chkon nti') || lower.includes('شكون نتي') || lower.includes('سند')) {
        return 'أنا سند، مساعدة ذكية للمرأة في المغرب. أنا هنا باش نهضر معاك، نسمعك، ونعطيك معلومات موثوقة يلا احتجتيها في أي وقت.';
      }
      if (lower.includes('chokran') || lower.includes('شكرا')) {
        return 'العفو، يسول فيك الخير! مرحبا بك دائماً، أنا هنا فأي وقت.';
      }
      return 'أهلاً بك! راني هنا باش نجاوبك ونهضر معاك بكل رحابة صدر. كيف نقدر نعاونك اليوم؟';
    }

    if (lang === 'arabic') {
      if (lower.includes('سلام') || lower.includes('مرحبا')) {
        return 'وعليكم السلام ورحمة الله وبركاته! أهلاً بكِ في سند. كيف حالكِ اليوم؟ يسعدني التحدث معكِ.';
      }
      if (lower.includes('شكرا')) {
        return 'على الرحب والسعة! أنا دائماً في خدمتكِ.';
      }
      if (lower.includes('من أنتِ') || lower.includes('شكون نتي')) {
        return 'أنا سند، مساعدتكِ الذكية المخصصة لدعم النساء والفتيات في المغرب. يمكنكِ التحدث معي بحرية في أي موضوع.';
      }
      return 'أهلاً وسهلاً بكِ! كيف يمكنني مساعدتكِ والتحدث معكِ اليوم؟';
    }

    // French
    if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) {
      return 'Bonjour ! Bienvenue sur SANAD. Comment vas-tu aujourd’hui ? Je suis là pour discuter et t’accompagner.';
    }
    if (lower.includes('merci')) {
      return 'Je t’en prie ! N’hésite pas si tu as la moindre question, je suis là pour toi.';
    }
    if (lower.includes('qui es-tu') || lower.includes('c\'est quoi')) {
      return 'Je suis SANAD, une assistante intelligente dédiée aux femmes au Maroc. Tu peux discuter librement avec moi, me poser des questions du quotidien ou t’informer sur tes droits.';
    }
    return 'Bonjour ! C’est un plaisir d’échanger avec toi. En quoi puis-je t’aider aujourd’hui ?';
  }

  // ── MODE C: SAFETY & EMERGENCY ──
  if (mode === 'MODE_C') {
    if (lang === 'arabizi') {
      return 'Salamtk hiya l2awla 9bel kolchi! Ana m3ak w machi bo7dk w ma kayn ta 7okm 3lik.\n' +
        'Ila knti f khtar fawri daba, 3ayti f l7al l had l2ar9am bila mo9abil:\n' +
        '📞 19 : Police Secours (fl-mdina)\n' +
        '📞 177 : Darak lmalaki (f l-3robia w barra)\n' +
        '📞 15 : Lwi9aya lmadaniya (ambulance)\n\n' +
        'Matwajhich lmo3tadi, khodi lwra9 dyalk w cartona w kherji l blassa amina 3nd 3ailtk wla a9rab commissariat. Nti machi bo7dk!';
    }
    if (lang === 'darija') {
      return 'سلامتك هي الأولى قبل كل شيء! أنا هنا معاك وماشي بوحدك وبلا ما نلوموك على حتى شي حاجة.\n' +
        'يلا كنتي فخطر فوري دابا عيطي فوراً لهاد الأرقام بالمجان:\n' +
        '📞 19 : الشرطة (فالمدينة)\n' +
        '📞 177 : الدرك الملكي (فالبادية)\n' +
        '📞 15 : الوقاية المدنية (إسعاف)\n\n' +
        'ما تواجهيش المعتدي، خدي أوراقك وبطاقة التعريف وسيري لبلاصة آمنة أو عند عائلتك ولا أقرب مركز شرطة. حنا فجنبك دائماً.';
    }
    if (lang === 'arabic') {
      return 'سلامتكِ وأمانكِ هما أولويتي القصوى. لستِ وحدكِ ونحن هنا لمساندتكِ بدون أي حكم.\n' +
        'إذا كنتِ في خطر أو تهديد فوري، يرجى الاتصال فوراً بأرقام الطوارئ المجانية:\n' +
        '📞 19 : الشرطة (في الوسط الحضري)\n' +
        '📞 177 : الدرك الملكي (في المناطق القروية)\n' +
        '📞 15 : الوقاية المدنية (الإسعاف)\n\n' +
        'لا تعرضي نفسكِ للمواجهة المباشرة، وحاولي التوجه فوراً إلى مكان آمن أو إلى أقرب دائرة أمنية أو مركز استماع.';
    }
    return 'Ta sécurité est la priorité absolue. Tu n’es pas seule et je suis là pour t’écouter sans aucun jugement.\n' +
      'Si tu es en danger immédiat, appelle tout de suite les secours gratuits au Maroc :\n' +
      '📞 19 : Police Secours (en zone urbaine)\n' +
      '📞 177 : Gendarmerie Royale (en zone rurale)\n' +
      '📞 15 : Protection Civile (Ambulance / Urgence médicale)\n\n' +
      'Ne prends aucun risque face à l’agresseur, mets-toi en sécurité dans un lieu sûr ou auprès de proches, et n’hésite pas à te faire accompagner par une cellule spécialisée.';
  }

  // ── MODE B: LEGAL INFORMATION & GUIDANCE ──
  if (lang === 'arabizi') {
    // Harassment
    if (lower.includes('ta7aroch') || lower.includes('taharoch') || lower.includes('taharrouch')) {
      return 'Matkhafich w 3rfi bli machi lkhat2 dyalk w l9anoun 103-13 fl-Meghrib kay3a9b b chidda 3la ay ta7aroch f chari3 wla fl-khdma (l7abs mn chher l 6 chhor w gharama).\n\n' +
        'Hadou lkhotowat l3amaliya li t9dri diri:\n' +
        '1. Khlli rasek f amane w b3di mn lmo3tadi.\n' +
        '2. Ila kaynin chouhad wla tsawer/videos khllihom 3ndk k dalil.\n' +
        '3. T9dri dfe3i chkaya l khaliyat takafoul b nisaa fl-ma7kama l-ibtida2iya wla f lcomissariat.\n' +
        '4. Kaynin jam3iyat fl-Meghrib (bhal FLDF, UAF, ATEC) li kay3awno bila mo9abil.\n\n' +
        'Ila knti f khtar fawri daba, 3ayti l 19 (police).';
    }

    // Rights
    if (lower.includes('7o9o9') || lower.includes('ho9oq') || lower.includes('droit')) {
      return '3ndk jmi3 l7o9o9 li kay7miha lik l9anoun lmeghribi (l9anoun 103-13, modawanat l2osra, w l9anoun ljina2i):\n' +
        '1. L7imaya l9anouniya: L9adi 3ndo l7a9 ybi3d lmo3tadi w ymna3o y9reb lik.\n' +
        '2. L7a9 f daf3 chkaya w moussa3ada 9ada2iya bila mo9abil.\n' +
        '3. Fl-hala dyal zawaj/tala9: 3ndk l7a9 fl-hadana, nafa9a, w sokna 7asab modawanat l2osra.\n\n' +
        'T9dri tchoufi tafasil f section Droits fl-app wla f adala.justice.gov.ma.';
    }

    // Associations
    if (lower.includes('jam3iya') || lower.includes('centre') || lower.includes('t3awni')) {
      return 'Kaynin bzaf dyal ljam3iyat lmowatta9a fl-Meghrib li kay9dmo l-istiqbal, l-istima3, w l-mowakaba l9anoniya bila mo9abil (f tab Help fl-app ghadi tl9ay l-annuaire dyal 12 jiha):\n' +
        '- Rbat: ADFM, UAF Annajda\n' +
        '- Casa: Solidarité Féminine (ASF), FLDF INJAD, Tahadi (ATEC)\n' +
        '- Fès: Centre Batha (IPDF)\n' +
        '- Marrakech: Annakhil\n' +
        '- Agadir: Voix de Femmes\n\n' +
        'T9dri t3ayti lihom direct mn l\'application.';
    }

    // Complaints
    if (lower.includes('nchki') || lower.includes('chkaya') || lower.includes('plainte')) {
      return 'Bach dfe3i chkaya fl-Meghrib, hadou lmarahil l2assassiya:\n' +
        '1. Chahada tibiya: Ila kan 3onf jassadi, siri l sbitar l3omomi bach takhdi chahada katbeyen moddat l3ajz (ITT).\n' +
        '2. Dfe3 chkaya: Siri l khaliyat takafoul b nisaa dahaya l3onf fl-ma7kama l-ibtida2iya (3nd wakil lmalik) wla f lcomissariat.\n' +
        '3. L2adila: Jm3i ay dalil (tsawer, messages, chouhad).\n' +
        '4. Khdma bila mo9abil: L-moussa3ada l9ada2iya kat3tik mo7ami fabor ila ma3ndkch lmadkhol.';
    }

    // Problem handling / Advice
    if (lower.includes('mochkil') || lower.includes('kifach nt3amel')) {
      return 'Awalan, khodi nafas 3amiq w mat9l9ich, ay mochkil 3ndo 7ell l9anoni w nafsi. 3awdi lia kter 3la lwad3iya dyalk bach n3tik nassi7a lmounassiba wla nwajhok l jam3iya wla cellule fl-ma7kama li t3awnk b tari9a sari3a.';
    }

    return 'L9anoun lmeghribi (khossousan l9anoun 103-13 w modawanat l2osra) kay7mi lmar2a w kay3a9b 3la ay no3 mn l3onf wla l\'ibtizaz.\n' +
      '1. Kol no3 dyal 3onf wla ta7aroch 3ndo 3o9oba jina2iya sarima.\n' +
      '2. Khaliyat takafoul b nisaa fl-ma7akem kaymchiw m3ak fl-ijra2at bila mo9abil.\n' +
      '3. T9dri tchoufi l9awanin f portal adala.justice.gov.ma wla tsta3mli annuaire dyal ljam3iyat fl-app.';
  }

  if (lang === 'darija') {
    // Harassment
    if (lower.includes('تحرش') || lower.includes('تعرضت للتحرش')) {
      return 'ما تخافيش وعارفي بلي ماشي نتي السبب، والقانون 103-13 فالمغرب كيعاقب بشدة على أي تحرش فالشارع أو الخدمة (الحبس من شهر لـ 6 أشهر وغرامة مالية).\n\n' +
        'هادو الخطوات العملية اللي تقدري تديري:\n' +
        '1. خلي راسك فأمان وبعدي من المتحرش.\n' +
        '2. يلا كاينين شهود أو رسائل/صور خليهم عندك كدليل.\n' +
        '3. تقدري تحطي شكاية بخلية التكفل بالنساء بالمحكمة الابتدائية أو بالدائرة الأمنية.\n' +
        '4. كاينين جمعيات موثوقة فالمغرب كيعاونوك بالمجان (بحال رابطة حقوق النساء، اتحاد العمل النسائي).\n\n' +
        'يلا كاين خطر دابا عيطي لـ 19 فوراً.';
    }

    // Rights
    if (lower.includes('حقوق') || lower.includes('حقوقي')) {
      return 'عندك جميع الحقوق اللي كيحميها ليك القانون المغربي (القانون 103-13 ومدونة الأسرة والقانون الجنائي):\n' +
        '1. الحماية القانونية: القاضي عندو الحق يصدر أمر فوري بإبعاد المعتدي ومنعه من الاقتراب.\n' +
        '2. حق الشكاية والمساعدة القضائية بالمجان بدون مصاريف للمحامي يلا كانت الوضعية صعبة.\n' +
        '3. فقضايا الأسرة: حقوق النفقة، الحضانة، والسكنى مضمونة بالمدونة.\n\n' +
        'تقدري تشوفي التفاصيل فقسم الحقوق فالتطبيق أو ببوابة عدالة (adala.justice.gov.ma).';
    }

    // Associations
    if (lower.includes('جمعية') || lower.includes('مركز') || lower.includes('تعاوني')) {
      return 'كاينين جمعيات ومراكز استماع موثوقة فجميع جهات المغرب الـ 12 كيقدمو الاستماع والدعم القانوني بالمجان (موجودة كاملة فصفحة المساعدة فالتطبيق):\n' +
        '- كازا: جمعية التضامن النسوي، فدرالية رابطة حقوق النساء، جمعية التحدي\n' +
        '- الرباط: الجمعية الديمقراطية لنساء المغرب (ADFM)، مركز النجدة\n' +
        '- فاس: مركز البطحاء لإيواء النساء\n' +
        '- مراكش: جمعية النخيل\n' +
        '- أكادير: صوت النساء المغربيات\n\n' +
        'تقدري تصوني ليهم مباشرة من التطبيق.';
    }

    // Complaints
    if (lower.includes('نشكي') || lower.includes('شكاية')) {
      return 'باش تحطي شكاية فالمغرب، هادو المراحل المعتمدة خطوة بخطوة:\n' +
        '1. شهادة طبية: يلا كان اعتداء جسدي، سيري لمستشفى عمومي تاخدي شهادة كتحدد مدة العجز المؤقت (ITT).\n' +
        '2. إيداع الشكاية: توجهي لخلية التكفل بالنساء بالمحكمة الابتدائية (عند وكيل الملك) أو بدائرة الشرطة.\n' +
        '3. الأدلة: جمعي أي رسائل، صور، أو بيانات شهود.\n' +
        '4. المساعدة القضائية: يلا ما عندكش إمكانيات، المحكمة كتعين ليك محامي بالمجان.';
    }

    return 'القانون المغربي (خصوصاً القانون 103-13 ومدونة الأسرة) كيحمي حقوق المرأة بشكل واضح:\n' +
      '1. كل أشكال العنف والتحرش والابتزاز الإلكتروني كيعاقب عليها القانون بعقوبات حبسية وغرامات مالية.\n' +
      '2. لتقديم شكاية: يمكنك التوجه لخلية التكفل بالنساء ضحايا العنف فالمحكمة الابتدائية أو الدائرة الأمنية مع شهادة طبية.\n' +
      '3. مصدر قانوني موثوق: بوابة وزارة العدل الرسمية (adala.justice.gov.ma).\n\n' +
      'هذه المعلومات استرشادية، ويمكنك استشارة محامٍ أو جمعية مختصة من دليل التطبيق لمرافقتك.';
  }

  if (lang === 'arabic') {
    return 'يوفر القانون المغربي (خاصة القانون 103-13 المتعلق بمحاربة العنف ضد النساء ومقتضيات مدونة الأسرة والقانون الجنائي) حماية قانونية شاملة:\n' +
      '1. تجريم كافة أشكال العنف الجسدي والنفسي والجنسي والاقتصادي، بالإضافة إلى تجريم الابتزاز ونشر الصور دون إذن (الفصول 447-1 و 503-1).\n' +
      '2. الإجراءات العملية: وضع شكاية لدى وكيل الملك أو بخلايا التكفل بالنساء بالمحاكم الابتدائية ومفوضيات الشرطة، معززة بشهادة طبية مجانية من المستشفى العمومي.\n' +
      '3. المرجع الرسمي: بوابة عدالة التابعة لوزارة العدل (adala.justice.gov.ma).\n\n' +
      'هذه الاستشارة للإرشاد القانوني العام، وينصح بالتواصل مع محامٍ معتمد للمتابعة القضائية.';
  }

  return 'Le droit marocain (notamment la Loi 103-13 relative à la lutte contre les violences faites aux femmes, le Code Pénal et le Code de la Famille) garantit une protection claire :\n' +
    '1. Interdiction et sanctions sévères contre les violences, le harcèlement de rue/au travail et le chantage numérique (art. 447-1 et 503-1-1 du Code Pénal).\n' +
    '2. Démarches recommandées : dépôt de plainte auprès de la Cellule de prise en charge au Tribunal de Première Instance ou au commissariat, avec certificat médical délivré par l’hôpital public.\n' +
    '3. Sources officielles : Portail Juridique Adala (adala.justice.gov.ma) et Bulletin Officiel (sgg.gov.ma).\n\n' +
    'Ces éléments vous informent sur vos droits. Pour une action en justice, l’assistance d’un avocat ou d’une association d’écoute est recommandée.';
}

module.exports = {
  SYSTEM_PROMPTS,
  buildMessages,
  generateAiResponse
};
