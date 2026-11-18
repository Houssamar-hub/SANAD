const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  module: {
    type: String,
    enum: ['auth', 'vault', 'shelter', 'empowerment', 'sos', 'admin', 'ai'],
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },
  anonymousSessionId: {
    type: String,
    default: ''
  },
  ipAnonymized: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
