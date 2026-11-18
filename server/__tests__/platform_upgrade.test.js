const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const evidenceController = require('../src/controllers/evidenceController');
const shelterController = require('../src/controllers/shelterController');
const opportunityController = require('../src/controllers/opportunityController');
const adminController = require('../src/controllers/adminController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('SANAD Advanced Platform Modules Tests', () => {
  // 1. Digital Evidence Vault
  describe('Digital Evidence Vault (Coffre-Fort Numérique)', () => {
    test('Creates evidence with SHA-256 hash and audit log', async () => {
      const req = {
        body: {
          title: 'Capture menace SMS',
          description: 'Message de chantage reçu sur WhatsApp',
          category: 'capture_ecran',
          notes: 'Dossier pour l\'avocate'
        },
        ip: '127.0.0.1'
      };
      const res = mockResponse();

      await evidenceController.createEvidence(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.evidence.title).toBe('Capture menace SMS');
      expect(data.evidence.hashSha256).toBeDefined();
      expect(data.evidence.encrypted).toBe(true);
    });

    test('Exports audit report with Moroccan legal disclaimer', async () => {
      const req = {};
      const res = mockResponse();

      await evidenceController.exportAuditReport(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.legalDisclaimer).toContain('appréciation souveraine du juge');
      expect(Array.isArray(data.report)).toBe(true);
    });
  });

  // 2. Dar L-Aman Safe Houses Network
  describe('Dar L-Aman Safe Houses Network', () => {
    test('Returns verified shelters with strict confidentiality protocol', async () => {
      const req = { query: { region: 'all' } };
      const res = mockResponse();

      await shelterController.getSafeHouses(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.protocol).toContain('rigoureusement confidentielles');
      expect(data.shelters.length).toBeGreaterThan(0);
      // All items must have verified partner organisations
      expect(data.shelters[0].partnerOrg).toBeDefined();
      expect(data.shelters[0].referralHotline).toBeDefined();
    });

    test('Filters safe houses by Moroccan region', async () => {
      const req = { query: { region: 'Casablanca-Settat' } };
      const res = mockResponse();

      await shelterController.getSafeHouses(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      const allCasa = data.shelters.every(s => s.region === 'Casablanca-Settat');
      expect(allCasa).toBe(true);
    });
  });

  // 3. Economic Empowerment (Tamkeen)
  describe('Economic Empowerment (Tamkeen)', () => {
    test('Returns legitimate verified Moroccan programs (Forsa, INDH, Entraide Nationale)', async () => {
      const req = { query: {} };
      const res = mockResponse();

      await opportunityController.getOpportunities(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.opportunities.length).toBeGreaterThan(0);
      const hasForsa = data.opportunities.some(o => o.title.includes('Forsa') || o.category === 'microfinance_forsa');
      expect(hasForsa).toBe(true);
    });

    test('Filters opportunities by category (couture_confection)', async () => {
      const req = { query: { category: 'couture_confection' } };
      const res = mockResponse();

      await opportunityController.getOpportunities(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.opportunities.every(o => o.category === 'couture_confection')).toBe(true);
    });
  });

  // 4. Admin Dashboard
  describe('Admin Dashboard & Audit Compliance', () => {
    test('Returns aggregate statistics with zero personal survivor identity disclosure', async () => {
      const req = {};
      const res = mockResponse();

      await adminController.getAdminStats(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.stats.regionsCovered).toBe(12);
      expect(data.stats.privacyPolicyCompliance).toContain('Loi 09-08');
      // Must not leak any user names, phone numbers, or victim identifiers
      expect(data.stats.survivorNames).toBeUndefined();
    });

    test('Returns security audit logs', async () => {
      const req = {};
      const res = mockResponse();

      await adminController.getAuditLogs(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.success).toBe(true);
      expect(data.logs.length).toBeGreaterThan(0);
    });
  });
});
