import React, { useState } from "react";
import axios from "axios";

const ExamBuilder = ({ classId }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [
        { text: "", correct: true },
        { text: "", correct: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const handleOptionCorrectChange = (qIndex, optIndex) => {
    const updated = [...questions];

    // Si quieres SOLO una correcta por pregunta:
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      correct: i === optIndex,
    }));

    // Si quisieras permitir varias correctas:
    // updated[qIndex].options[optIndex].correct = !updated[qIndex].options[optIndex].correct;

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", correct: true },
          { text: "", correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", correct: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        classId,
        title,
        questions,
      };

      const res = await axios.post("/api/exams", payload);
      setMessage("Examen creado correctamente ✅");
      console.log("Exam creado:", res.data);

      // Puedes limpiar el formulario si quieres:
      // setTitle("");
      // setQuestions([...]);
    } catch (err) {
      console.error(err);
      setMessage("Error al crear el examen ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Crear examen</h2>

      <div>
        <label>Título del examen</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 16 }}
        />
      </div>

      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Pregunta {qIndex + 1}</h3>
            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qIndex)}>
                Eliminar pregunta
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Texto de la pregunta"
            value={q.text}
            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
            required
          />

          <div style={{ marginTop: 8 }}>
            <strong>Opciones:</strong>
            {q.options.map((opt, optIndex) => (
              <div
                key={optIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={opt.correct === true}
                  onChange={() => handleOptionCorrectChange(qIndex, optIndex)}
                />
                <input
                  type="text"
                  placeholder={`Opción ${optIndex + 1}`}
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionTextChange(qIndex, optIndex, e.target.value)
                  }
                  style={{ flex: 1 }}
                  required
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, optIndex)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addOption(qIndex)}
              style={{ marginTop: 8 }}
            >
              + Agregar opción
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        + Agregar pregunta
      </button>

      <div style={{ marginTop: 24 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar examen"}
        </button>
      </div>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </form>
  );
};

export default ExamBuilder;
