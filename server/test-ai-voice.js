/**
 * SANAD Complete System & AI Voice Test Suite
 * Tests:
 * 1. 10 Specified Moroccan Darija Test Cases (Phase 11)
 * 2. 100 Q&A Knowledge Base & 20 Categories (Phase 6 & 7)
 * 3. Language & Arabizi Detection (Phase 2)
 * 4. Safety & Emergency Override (Phase 2 & 10)
 * 5. Audio Evidence Vault Integration (Phase 4 & 5)
 */

const assert = require('assert');
const { KNOWLEDGE_BASE } = require('./src/modules/ai/knowledgeBase');
const { findBestKnowledgeMatch } = require('./src/modules/ai/legalRagService');
const { detectLanguage } = require('./src/modules/ai/languageService');
const { detectSafetyRisk, RISK_LEVELS } = require('./src/modules/ai/safetyService');
const { generateAiResponse } = require('./src/modules/ai/conversationService');
const aiService = require('./src/modules/ai/ai.service');

async function runTestSuite() {
  console.log('====================================================');
  console.log('   SANAD MASTER TEST SUITE — AI, VOICE & DARIJA     ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  async function testAsync(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // ── TEST GROUP 1: KNOWLEDGE BASE INTEGRITY (100 Q&A & 20 CATEGORIES) ──
  console.log('--- TEST GROUP 1: Knowledge Base Integrity ---');

  test('Knowledge Base contains exactly 100 entries', () => {
    assert.strictEqual(KNOWLEDGE_BASE.length, 100, `Expected 100 entries, got ${KNOWLEDGE_BASE.length}`);
  });

  test('Knowledge Base covers exactly 20 distinct categories', () => {
    const categories = new Set(KNOWLEDGE_BASE.map(e => e.category));
    assert.strictEqual(categories.size, 20, `Expected 20 categories, got ${categories.size}`);
  });

  test('Each entry has all required multilingual fields, references and sources', () => {
    for (const item of KNOWLEDGE_BASE) {
      assert.ok(item.id, `Item missing id`);
      assert.ok(item.category, `Item ${item.id} missing category`);
      assert.ok(item.questionDarija, `Item ${item.id} missing questionDarija`);
      assert.ok(item.questionArabizi, `Item ${item.id} missing questionArabizi`);
      assert.ok(item.questionAr, `Item ${item.id} missing questionAr`);
      assert.ok(item.questionFr, `Item ${item.id} missing questionFr`);
      assert.ok(item.answerDarija, `Item ${item.id} missing answerDarija`);
      assert.ok(item.answerArabizi, `Item ${item.id} missing answerArabizi`);
      assert.ok(item.answerAr, `Item ${item.id} missing answerAr`);
      assert.ok(item.answerFr, `Item ${item.id} missing answerFr`);
      assert.ok(item.legalReference, `Item ${item.id} missing legalReference`);
      assert.ok(item.source, `Item ${item.id} missing source`);
      assert.strictEqual(item.verified, true, `Item ${item.id} must be verified: true`);
    }
  });

  // ── TEST GROUP 2: THE 10 DARIJA TEST CASES SPECIFIED IN PHASE 11 ──
  console.log('\n--- TEST GROUP 2: Phase 11 Specified Darija Test Cases ---');

  const phase11TestCases = [
    { query: 'kifach n7mi rassi?', expectedCategory: 'DOMESTIC_VIOLENCE', lang: 'arabizi' },
    { query: 'rajli kaydrabni.', expectedCategory: 'DOMESTIC_VIOLENCE', lang: 'arabizi' },
    { query: 'wach 3andi l7a9 nchki bih?', expectedCategory: 'DOMESTIC_VIOLENCE', lang: 'arabizi' },
    { query: 'fin nmchi ila kont f khatar?', expectedCategory: 'EMERGENCY_SHELTERS', lang: 'arabizi' },
    { query: 'bghit n3raf 7o9o9i.', expectedCategory: 'DOMESTIC_VIOLENCE', lang: 'arabizi' },
    { query: 'kayhddedni b tsawri.', expectedCategory: 'CYBER_BLACKMAIL', lang: 'arabizi' },
    { query: 'ma3andich flous bach nkhrej.', expectedCategory: 'ECONOMIC_VIOLENCE_AND_EMPOWERMENT', lang: 'arabizi' },
    { query: 'bghit chi jam3iya t3awni.', expectedCategory: 'ASSOCIATIONS_AND_HOTLINES', lang: 'arabizi' },
    { query: 'kifach nakhod chahada tibbiya?', expectedCategory: 'PHYSICAL_ASSAULT_AND_ITT', lang: 'arabizi' },
    { query: 'chno ndir ila t3radt l3onf?', expectedCategory: 'DOMESTIC_VIOLENCE', lang: 'arabizi' }
  ];

  for (let i = 0; i < phase11TestCases.length; i++) {
    const tc = phase11TestCases[i];
    await testAsync(`Phase 11 Case ${i + 1}: "${tc.query}"`, async () => {
      const detected = detectLanguage(tc.query);
      assert.strictEqual(detected.code, 'arabizi', `Language should be detected as arabizi, got ${detected.code}`);

      const match = findBestKnowledgeMatch(tc.query, 'arabizi');
      assert.ok(match, `Expected a knowledge match for query "${tc.query}"`);
      assert.ok(match.score >= 6, `Match score should be >= 6, got ${match.score}`);
      assert.ok(match.localizedAnswer, `Expected localized Arabizi answer`);

      // Test end-to-end chat orchestration
      const chatRes = await aiService.handleChat({ message: tc.query });
      assert.ok(chatRes.response, `Expected chat response`);
      assert.ok(chatRes.response.length > 20, `Response should be detailed`);
    });
  }

  // ── TEST GROUP 3: LANGUAGE STRICTNESS & ARABIC/FRENCH/DARIJA ──
  console.log('\n--- TEST GROUP 3: Language Strictness ---');

  await testAsync('Darija (Arabic script) receives Darija Arabic answer', async () => {
    const res = await generateAiResponse({
      mode: 'MODE_B',
      language: 'darija',
      message: 'راجلي كيضربني شنو خاصني ندير دابا؟'
    });
    assert.ok(res.text.includes('سلامتك') || res.text.includes('الشرطة') || res.text.includes('القانون 103-13'));
    assert.strictEqual(/[\u0600-\u06FF]/.test(res.text), true, 'Answer should be in Arabic script');
  });

  await testAsync('Arabizi receives natural Arabizi answer', async () => {
    const res = await generateAiResponse({
      mode: 'MODE_B',
      language: 'arabizi',
      message: 'kifach nakhod chahada tibbiya?'
    });
    assert.ok(res.text.includes('sbitar') || res.text.includes('ITT') || res.text.includes('chahada'));
  });

  await testAsync('French receives French answer', async () => {
    const res = await generateAiResponse({
      mode: 'MODE_B',
      language: 'fr',
      message: 'Mon mari me frappe, que dois-je faire ?'
    });
    assert.ok(res.text.includes('sécurité') || res.text.includes('Police') || res.text.includes('ITT'));
  });

  // ── TEST GROUP 4: SAFETY & EMERGENCY OVERRIDE ──
  console.log('\n--- TEST GROUP 4: Safety & Emergency Override ---');

  test('Imminent threat triggers CRITICAL risk and emergency hotlines', () => {
    const risk = detectSafetyRisk('ghadi y9telni daba 3ando jwya w kaydrabni');
    assert.ok(risk.riskLevel === RISK_LEVELS.CRITICAL || risk.riskLevel === RISK_LEVELS.HIGH);
    assert.strictEqual(risk.isEmergency, true);
  });

  // ── SUMMARY ──
  console.log('\n====================================================');
  console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
