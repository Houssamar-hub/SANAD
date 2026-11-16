/**
 * SANAD AI Assistant - Dataset Evaluation & Benchmark Script
 * Evaluates intent classification, mode assignment, language detection,
 * and calculates Precision, Recall, F1 score, and Safety False Negative Rate (FNR).
 */

const fs = require('fs');
const path = require('path');
const { classifyIntent } = require('../modules/ai/intentService');
const { detectLanguage } = require('../modules/ai/languageService');

function evaluateDataset(splitName = 'test.json') {
  const filePath = path.join(__dirname, '../../data/dataset', splitName);

  if (!fs.existsSync(filePath)) {
    console.error(`Dataset split file not found: ${filePath}`);
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`\n=============================================================`);
  console.log(`  ÉVALUATION DU SYSTÈME IA SANAD SUR LE DATASET : ${splitName}`);
  console.log(`  Nombre d'exemples évalués : ${dataset.length}`);
  console.log(`=============================================================\n`);

  const intentStats = {};
  let totalCorrectIntents = 0;
  let totalCorrectModes = 0;
  let totalEmergencyCases = 0;
  let emergencyFalseNegatives = 0;

  for (const item of dataset) {
    const expectedIntent = item.intent;
    const expectedMode = item.mode;

    // Initialize stats container if needed
    if (!intentStats[expectedIntent]) {
      intentStats[expectedIntent] = { tp: 0, fp: 0, fn: 0, total: 0 };
    }
    intentStats[expectedIntent].total++;

    const detectedLang = detectLanguage(item.text);
    const prediction = classifyIntent(item.text, detectedLang);
    const predictedIntent = prediction.primaryIntent;
    const predictedMode = prediction.mode;

    if (!intentStats[predictedIntent]) {
      intentStats[predictedIntent] = { tp: 0, fp: 0, fn: 0, total: 0 };
    }

    // Intent evaluation
    if (predictedIntent === expectedIntent) {
      intentStats[expectedIntent].tp++;
      totalCorrectIntents++;
    } else {
      intentStats[expectedIntent].fn++;
      intentStats[predictedIntent].fp++;
    }

    // Mode evaluation
    if (predictedMode === expectedMode) {
      totalCorrectModes++;
    }

    // Safety / Emergency Monitoring
    if (expectedIntent === 'EMERGENCY' || expectedMode === 'MODE_C') {
      totalEmergencyCases++;
      if (predictedMode !== 'MODE_C' && !prediction.isEmergency) {
        emergencyFalseNegatives++;
        console.warn(`[SAFETY ALERT] Faux Négatif Détecté : "${item.text}"`);
      }
    }
  }

  // Print Per-Intent Table
  console.log(`| Intent                          | Support | Precision | Recall    | F1-Score  |`);
  console.log(`|---------------------------------|---------|-----------|-----------|-----------|`);

  let macroF1Sum = 0;
  let evaluatedIntentCount = 0;

  const allIntents = Object.keys(intentStats).filter(intent => intentStats[intent].total > 0);

  for (const intent of allIntents) {
    const { tp, fp, fn, total } = intentStats[intent];
    const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall / (precision + recall)) : 0;

    macroF1Sum += f1;
    evaluatedIntentCount++;

    const padIntent = intent.padEnd(31);
    const padTotal = String(total).padStart(7);
    const padP = (precision * 100).toFixed(1).padStart(7) + '%';
    const padR = (recall * 100).toFixed(1).padStart(7) + '%';
    const padF = (f1 * 100).toFixed(1).padStart(7) + '%';

    console.log(`| ${padIntent} | ${padTotal} | ${padP} | ${padR} | ${padF} |`);
  }

  const accuracy = (totalCorrectIntents / dataset.length) * 100;
  const modeAccuracy = (totalCorrectModes / dataset.length) * 100;
  const macroF1 = evaluatedIntentCount > 0 ? (macroF1Sum / evaluatedIntentCount) * 100 : 0;
  const safetyFnr = totalEmergencyCases > 0 ? (emergencyFalseNegatives / totalEmergencyCases) * 100 : 0;

  console.log(`-------------------------------------------------------------`);
  console.log(`  Exactitude globale des Intents (Accuracy) : ${accuracy.toFixed(1)}%`);
  console.log(`  Exactitude des Modes (Mode A / B / C)     : ${modeAccuracy.toFixed(1)}%`);
  console.log(`  Macro-F1 Score moyen                      : ${macroF1.toFixed(1)}%`);
  console.log(`  Cas d'urgence / détresse évalués          : ${totalEmergencyCases}`);
  console.log(`  Taux de faux négatifs de sécurité (FNR)   : ${safetyFnr.toFixed(1)}% ${safetyFnr === 0 ? '✅ (PARFAIT - 0 Faux Négatifs)' : '⚠️'}`);
  console.log(`=============================================================\n`);

  return {
    accuracy,
    modeAccuracy,
    macroF1,
    safetyFnr,
    totalCount: dataset.length
  };
}

// Run evaluation on test.json if executed directly
if (require.main === module) {
  evaluateDataset('test.json');
}

module.exports = { evaluateDataset };
