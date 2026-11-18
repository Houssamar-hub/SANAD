const { classifyIntent, INTENTS } = require('../src/modules/ai/intentService');
const { detectLanguage, LANGUAGES } = require('../src/modules/ai/languageService');
const { generateAiResponse } = require('../src/modules/ai/conversationService');

describe('SANAD Moroccan Darija & Arabizi AI Assistant Tests', () => {
  test('1. "Salam, labas 3lik?" -> Natural greeting in Arabizi (Mode A)', async () => {
    const input = 'Salam, labas 3lik?';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.GENERAL_CONVERSATION);
    expect(intent.mode).toBe('MODE_A');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text.toLowerCase()).toContain('salam');
    expect(res.text.toLowerCase()).toContain('labas');
  });

  test('2. "Bghit nsawlk 3la chi haja." -> Receptive conversational opening (Mode A)', async () => {
    const input = 'Bghit nsawlk 3la chi haja.';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.GENERAL_CONVERSATION);
    expect(intent.mode).toBe('MODE_A');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text.toLowerCase()).toContain('merhba');
  });

  test('3. "Ana t3rdt lta7aroch, achno ndir?" -> Sexual Harassment guidance (Mode B)', async () => {
    const input = 'Ana t3rdt lta7aroch, achno ndir?';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.SEXUAL_HARASSMENT);
    expect(intent.mode).toBe('MODE_B');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text).toContain('103-13');
  });

  test('4. "Wash 3andi chi 7o9o9 f had l7ala?" -> Legal Rights inquiry (Mode B)', async () => {
    const input = 'Wash 3andi chi 7o9o9 f had l7ala?';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.LEGAL_QUESTION);
    expect(intent.mode).toBe('MODE_B');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text.toLowerCase()).toContain('7o9o9');
  });

  test('5. "Fin n9der nl9a chi jam3iya t3awni?" -> Support Request (Mode B)', async () => {
    const input = 'Fin n9der nl9a chi jam3iya t3awni?';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.REQUEST_SUPPORT);
    expect(intent.mode).toBe('MODE_B');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text.toLowerCase()).toContain('jam3iyat');
  });

  test('6. "Bghit n3ref kifach n9der nchki." -> Legal Procedure (Mode B)', async () => {
    const input = 'Bghit n3ref kifach n9der nchki.';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.ARABIZI);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.LEGAL_PROCEDURE);
    expect(intent.mode).toBe('MODE_B');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text.toLowerCase()).toContain('chkaya');
  });

  test('7. "أنا تعرضت للتحرش، أشنو ندير؟" -> Arabic Darija script harassment (Mode B)', async () => {
    const input = 'أنا تعرضت للتحرش، أشنو ندير؟';
    const lang = detectLanguage(input);
    expect(lang.code).toBe(LANGUAGES.DARIJA);

    const intent = classifyIntent(input, lang);
    expect(intent.primaryIntent).toBe(INTENTS.SEXUAL_HARASSMENT);
    expect(intent.mode).toBe('MODE_B');

    const res = await generateAiResponse({
      mode: intent.mode,
      language: lang,
      message: input
    });
    expect(res.text).toContain('103-13');
  });
});
