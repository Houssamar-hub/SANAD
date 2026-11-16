const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const { quizzes } = require('../utils/seedData');

const getQuizzes = async (req, res, next) => {
  try {
    let list = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        list = await Quiz.find();
      } catch (e) {
        list = [];
      }
    }

    if (!isDbConnected || list.length === 0) {
      list = quizzes;
    }

    res.json({
      success: true,
      count: list.length,
      quizzes: list
    });
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = null;
    try {
      quiz = await Quiz.findById(id);
    } catch (e) {
      quiz = quizzes.find((q, idx) => String(idx) === id || q.title.includes(id));
    }

    if (!quiz) {
      quiz = quizzes.find((q, idx) => String(idx) === id);
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz introuvable.' });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of chosen indices
    const { id } = req.params;

    let quiz = null;
    try {
      quiz = await Quiz.findById(id);
    } catch (e) {
      quiz = quizzes.find((q, idx) => String(idx) === id);
    }

    if (!quiz) {
      quiz = quizzes[0];
    }

    let score = 0;
    const results = (quiz.questions || []).map((q, idx) => {
      const selected = answers ? answers[idx] : null;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) score += 1;
      return {
        questionIndex: idx,
        userAnswer: selected,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
        legalReference: q.legalReference
      };
    });

    res.json({
      success: true,
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz
};
