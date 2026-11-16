const { detectLanguage, checkEmergency, processUserQuery } = require('../src/services/ragService');
const { legalDocuments, supportCenters, quizzes } = require('../src/utils/seedData');

jest.setTimeout(20000);

describe('SANAD Core Services & Intelligence', () => {
  test('Language Detection: Darija in Arabic characters', () => {
    expect(detectLanguage('شنو ندير إذا شي واحد كيهددني بالصور ديالي؟')).toBe('darija');
  });

  test('Language Detection: Arabizi (Darija latinisée)', () => {
    expect(detectLanguage('Chno ndir ila chi wahed kayhaddedni ?')).toBe('darija_arabizi');
    expect(detectLanguage('Wach 3andi l7a9 n9dem chikwa ?')).toBe('darija_arabizi');
  });

  test('Language Detection: Standard French', () => {
    expect(detectLanguage('Comment déposer une plainte pour harcèlement au travail ?')).toBe('fr');
  });

  test('Emergency Detection: Imminent danger triggers emergency flag', () => {
    expect(checkEmergency('Au secours il me bat')).toBe(true);
    expect(checkEmergency('خطر عتقوني كيضربني دابا')).toBe(true);
    expect(checkEmergency('3t9ouni kaydrabni daba')).toBe(true);
  });

  test('Emergency Detection: Regular questions do not trigger emergency', () => {
    expect(checkEmergency('Quelles sont les démarches pour un divorce par consentement mutuel ?')).toBe(false);
  });

  test('Legal Knowledge Base integrity: Loi 103-13 is present and verified', () => {
    const loi103 = legalDocuments.find(d => d.lawNumber.includes('103-13'));
    expect(loi103).toBeDefined();
    expect(loi103.simplifiedExplanation).toContain('2018');
    expect(loi103.possibleSteps.length).toBeGreaterThanOrEqual(2);
  });

  test('Support Centers: Casablanca, Rabat, Marrakech, Fès, Tanger are represented', () => {
    const cities = supportCenters.map(c => c.city);
    expect(cities).toContain('Casablanca');
    expect(cities).toContain('Rabat');
    expect(cities).toContain('Marrakech');
    expect(cities).toContain('Fès');
    expect(cities).toContain('Tanger');
    expect(supportCenters.every(c => c.phone && c.coordinates)).toBe(true);
  });

  test('Quizzes: Contain questions with valid options and explanations', () => {
    expect(quizzes.length).toBeGreaterThan(0);
    const q1 = quizzes[0].questions[0];
    expect(q1.options.length).toBeGreaterThanOrEqual(3);
    expect(q1.correctAnswerIndex).toBeDefined();
    expect(q1.explanation.length).toBeGreaterThan(10);
  });

  test('RAG Query: Returns structured guidance for cyberharassment with local fallback', async () => {
    const result = await processUserQuery({
      message: 'On me menace de diffuser des photos intimes sur Instagram que faire ?',
      userPreferredLanguage: 'fr'
    });

    expect(result.answer).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(50);
    expect(result.sources.length).toBeGreaterThanOrEqual(1);
  });
});
