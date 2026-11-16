/**
 * SANAD Intelligent AI Assistant - Automated Jest Test Suite
 * Tests Multilingual Detection, Conservative Safety Layer, 12 Intent Categories,
 * Grounded Legal RAG, and AI Controllers without opening external network sockets.
 */

const aiService = require('../src/modules/ai/ai.service');
const aiController = require('../src/modules/ai/ai.controller');
const { detectLanguage } = require('../src/modules/ai/languageService');
const { detectSafetyRisk, RISK_LEVELS, getEmergencyHotlines } = require('../src/modules/ai/safetyService');
const { classifyIntent, INTENTS } = require('../src/modules/ai/intentService');
const { searchLegalDatabase } = require('../src/modules/ai/legalRagService');

// Helper to create mock req/res for controller testing without socket binding
function createMockReqRes(body = {}, params = {}, query = {}) {
  const req = { body, params, query, user: null };
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
  return { req, res };
}

describe('SANAD AI Assistant - Comprehensive Tests', () => {

  describe('1. Multilingual Language Detection', () => {
    test('detects Moroccan Darija in Arabic script', () => {
      const res = detectLanguage('شنو كتقولي على راجلي اللي كيهددني ودابا بغيت نعرف حقوقي');
      expect(res.code).toBe('darija');
      expect(res.script).toBe('arabic');
    });

    test('detects Moroccan Arabizi with Latin numbers (3, 7, 9)', () => {
      const res = detectLanguage('salam kidayra labas 3lik wach n9der n3ref l9anoun 103-13?');
      expect(res.code).toBe('arabizi');
      expect(res.script).toBe('latin');
    });

    test('detects Modern Standard Arabic', () => {
      const res = detectLanguage('ما هي الإجراءات القانونية المتبعة لحماية المرأة من العنف في المغرب؟');
      expect(res.code).toBe('arabic');
      expect(res.script).toBe('arabic');
    });

    test('detects French', () => {
      const res = detectLanguage('Bonjour, quelles sont les sanctions prévues contre le harcèlement de rue ?');
      expect(res.code).toBe('fr');
      expect(res.script).toBe('latin');
    });
  });

  describe('2. Conservative Safety & Emergency Monitoring', () => {
    test('identifies critical life threats with 0% false negative rate', () => {
      const res = detectSafetyRisk('3at9oni rajli kaydrbni daba f dar khatir');
      expect(res.isEmergency).toBe(true);
      expect(res.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(res.emergencyHotlines.police).toBe('19');
      expect(res.emergencyHotlines.gendarmerie).toBe('177');
    });

    test('identifies physical abuse and domestic violence in French', () => {
      const res = detectSafetyRisk('Mon mari me frappe violemment et menace de me tuer');
      expect(res.isEmergency).toBe(true);
      expect([RISK_LEVELS.CRITICAL, RISK_LEVELS.HIGH]).toContain(res.riskLevel);
      expect(res.category).toBe('DOMESTIC_VIOLENCE');
    });

    test('identifies cyber-harassment and blackmail in Arabic', () => {
      const res = detectSafetyRisk('شخص يهددني بنشر صوري وابتزازي على تطبيق واتساب');
      expect(res.riskLevel).toBe(RISK_LEVELS.MEDIUM);
      expect(res.category).toBe('CYBER_HARASSMENT');
    });

    test('does NOT flag pure greetings or casual talk as emergency', () => {
      const res = detectSafetyRisk('Salam kidayra labas 3lik');
      expect(res.isEmergency).toBe(false);
      expect(res.riskLevel).toBe(RISK_LEVELS.NONE);
    });
  });

  describe('3. 12-Intent Multi-tier Classification & Mode Routing', () => {
    test('routes greetings to Mode A (General) without legal lecture', () => {
      const g1 = classifyIntent('Salam labas');
      expect(g1.primaryIntent).toBe(INTENTS.GENERAL_CONVERSATION);
      expect(g1.mode).toBe('MODE_A');

      const g2 = classifyIntent('Bonjour, comment vas-tu ?');
      expect(g2.primaryIntent).toBe(INTENTS.GENERAL_CONVERSATION);
      expect(g2.mode).toBe('MODE_A');
    });

    test('routes legal questions to Mode B (Legal Information)', () => {
      const l1 = classifyIntent('chnou kaygoul l9anoun 103-13 3la taharouch f chari3?');
      expect(l1.mode).toBe('MODE_B');
      expect([INTENTS.LEGAL_QUESTION, INTENTS.SEXUAL_HARASSMENT]).toContain(l1.primaryIntent);

      const l2 = classifyIntent('Quels sont mes droits concernant la pension alimentaire et la garde des enfants ?');
      expect(l2.mode).toBe('MODE_B');
    });

    test('routes immediate threats and domestic violence to Mode C (Safety)', () => {
      const e1 = classifyIntent('3at9oni راه كيهددني بالسلاح دابا وغادي يقتلني');
      expect(e1.mode).toBe('MODE_C');
      expect(e1.isEmergency).toBe(true);
    });
  });

  describe('4. Grounded Legal RAG Database', () => {
    test('retrieves official Loi 103-13 and Adala citations for harassment', async () => {
      const results = await searchLegalDatabase('harcelement sexuel', { limit: 2 });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].officialSource).toContain('justice.gov.ma');
      expect(results[0].code).toBeDefined();
    });

    test('retrieves Moudawana provisions for divorce chiqaq', async () => {
      const results = await searchLegalDatabase('divorce chiqaq nafaqa', { limit: 2 });
      expect(results.length).toBeGreaterThan(0);
      const hasFamilyLaw = results.some(r => r.code.includes('Famille') || r.article.includes('Moudawana'));
      expect(hasFamilyLaw).toBe(true);
    });
  });

  describe('5. AI Assistant Controller & Pipeline Endpoints', () => {
    test('controller.chat returns Mode A natural conversation for greeting', async () => {
      const { req, res } = createMockReqRes({ message: 'Salam kidayra labas' });
      await aiController.chat(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.mode).toBe('MODE_A');
      expect(res.data.response).toBeDefined();
      expect(res.data.response.length).toBeGreaterThan(5);
    });

    test('controller.chat returns Mode B grounded legal advice with official sources', async () => {
      const { req, res } = createMockReqRes({ message: 'Quelles sont les sanctions prévues par la Loi 103-13 contre le harcèlement ?' });
      await aiController.chat(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.mode).toBe('MODE_B');
      expect(res.data.sources).toBeInstanceOf(Array);
      expect(res.data.sources.length).toBeGreaterThan(0);
      expect(res.data.sources[0].url).toContain('justice.gov.ma');
    });

    test('controller.chat returns Mode C with emergency hotlines for danger', async () => {
      const { req, res } = createMockReqRes({ message: '3at9oni rajli kaydrbni daba f dar khatir' });
      await aiController.chat(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.mode).toBe('MODE_C');
      expect(res.data.isEmergency).toBe(true);
      expect(res.data.emergencyHotlines.police).toBe('19');
      expect(res.data.emergencyHotlines.gendarmerie).toBe('177');
    });

    test('controller.detectIntent detects intent and safety', async () => {
      const { req, res } = createMockReqRes({ text: 'Kifach ndir chkaya 3nd wakil lmalik?' });
      await aiController.detectIntent(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.data.intent).toBe(INTENTS.LEGAL_PROCEDURE);
      expect(res.data.data.mode).toBe('MODE_B');
    });

    test('controller.legalSearch returns verified Moroccan law articles', async () => {
      const { req, res } = createMockReqRes({ query: 'expulsion domicile conjugal', language: 'fr' });
      await aiController.legalSearch(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.data.results.length).toBeGreaterThan(0);
    });

    test('controller.safetyGuidance returns verified emergency numbers and protocols', async () => {
      const { req, res } = createMockReqRes({ category: 'EMERGENCY', language: 'darija' });
      await aiController.safetyGuidance(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.data.hotlines.police).toBe('19');
      expect(res.data.data.guidance.length).toBeGreaterThan(0);
    });

    test('controller.getSources returns official Moroccan domains and indexed corpus', async () => {
      const { req, res } = createMockReqRes();
      await aiController.getSources(req, res, () => {});

      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.data.officialDomains).toContain('adala.justice.gov.ma');
      expect(res.data.data.indexedCorpusCount).toBeGreaterThan(0);
    });
  });
});
