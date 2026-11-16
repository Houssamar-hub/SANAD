const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Format email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  preferredLanguage: z.enum(['fr', 'ar', 'darija']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Format email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

const chatSchema = z.object({
  message: z.string().min(1, 'Le message ne peut pas être vide'),
  history: z.array(z.any()).optional().default([]),
  language: z.enum(['fr', 'ar', 'darija', 'darija_arabizi']).optional().default('fr')
});

const trustedContactSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  phone: z.string().min(6, 'Numéro de téléphone requis'),
  relationship: z.string().optional().default('Ami(e) / Proche'),
  guestDeviceId: z.string().optional()
});

const incidentSchema = z.object({
  incidentType: z.string().min(1, 'Type d\'incident requis'),
  description: z.string().min(3, 'Description requise'),
  location: z.string().optional(),
  incidentDate: z.string().optional(),
  guestDeviceId: z.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  chatSchema,
  trustedContactSchema,
  incidentSchema
};
