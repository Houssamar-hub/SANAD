/**
 * SANAD AI Assistant - Request Validators
 */

const { z } = require('zod');

const chatSchema = z.object({
  message: z.string({ required_error: 'Le message est requis' }).min(1, 'Le message ne peut pas être vide').max(2000, 'Le message est trop long'),
  history: z.array(z.object({
    sender: z.enum(['user', 'bot', 'assistant', 'model']).optional(),
    role: z.enum(['user', 'bot', 'assistant', 'model']).optional(),
    text: z.string().optional(),
    content: z.string().optional()
  })).optional().default([]),
  language: z.enum(['darija', 'arabizi', 'arabic', 'fr', 'en']).optional()
});

const detectIntentSchema = z.object({
  text: z.string({ required_error: 'Le texte est requis' }).min(1, 'Le texte ne peut pas être vide').max(1000)
});

const legalSearchSchema = z.object({
  query: z.string({ required_error: 'La requête de recherche est requise' }).min(2, 'Requête trop courte'),
  category: z.string().optional(),
  language: z.enum(['darija', 'arabizi', 'arabic', 'fr']).optional().default('fr')
});

const safetyGuidanceSchema = z.object({
  category: z.string().optional(),
  language: z.enum(['darija', 'arabizi', 'arabic', 'fr']).optional().default('fr')
});

module.exports = {
  chatSchema,
  detectIntentSchema,
  legalSearchSchema,
  safetyGuidanceSchema
};
