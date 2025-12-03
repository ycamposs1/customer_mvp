// src/controllers/examController.js
const { createExamWithQuestions } = require('../repositories/examRepository');

async function createExam(req, res) {
  try {
    const { classId, title, questions, durationMinutes } = req.body;

    // Validaciones básicas
    if (!classId || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: 'classId, title y al menos una pregunta son obligatorios',
      });
    }

    // Opcional: validar estructura mínima de cada pregunta
    for (const q of questions) {
      if (!q.text || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          message: 'Cada pregunta debe tener texto y al menos 2 opciones',
        });
      }
      const hasCorrect = q.options.some(o => o.correct === true);
      if (!hasCorrect) {
        return res.status(400).json({
          message: 'Cada pregunta debe tener al menos una opción correcta',
        });
      }
    }

    const exam = await createExamWithQuestions({ classId, title, questions, durationMinutes });
    return res.status(201).json(exam);
  } catch (err) {
    console.error('Error creando examen:', err);
    return res.status(500).json({ message: 'Error interno al crear el examen' });
  }
}

module.exports = { createExam };
