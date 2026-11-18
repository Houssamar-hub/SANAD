const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const env = require('./config/env');
const { connectDB, getStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const legalRoutes = require('./routes/legalRoutes');
const centerRoutes = require('./routes/centerRoutes');
const preventionRoutes = require('./routes/preventionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const trustedContactRoutes = require('./routes/trustedContactRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const userRoutes = require('./routes/userRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id']
}));

// Rate limiting (120 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez patienter un instant.'
  }
});
app.use('/api', limiter);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health and Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SANAD API',
    tagline: 'Vous n\'êtes jamais seule.',
    version: '1.0.0',
    db: getStatus(),
    aiConfig: {
      geminiConfigured: !!env.GEMINI_API_KEY,
      tavilyConfigured: !!env.TAVILY_API_KEY
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/prevention', preventionRoutes);
app.use('/api/campaigns', preventionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/trusted-contacts', trustedContactRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

// Connect DB & Start Server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(env.PORT, () => {
      console.log(`====================================================`);
      console.log(`  SANAD API Backend démarré sur http://localhost:${env.PORT}`);
      console.log(`  Slogan: « Vous n'êtes jamais seule. »`);
      console.log(`  Protection • Droits • Accompagnement (CNDH Maroc)`);
      console.log(`====================================================`);
    });
  });
}

module.exports = app;
