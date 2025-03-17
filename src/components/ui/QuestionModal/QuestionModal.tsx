import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { Question, Answer } from "../../../types/reduxTypes";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Omit<Question, "id">) => void;
  questionType: "single" | "multiple" | "number" | "text";
  initialData?: Question | null;
}

const questionTypeLabels: Record<QuestionModalProps["questionType"], string> = {
  single: "Einzelauswahl",
  multiple: "Mehrfachauswahl",
  number: "Zahleneingabe",
  text: "Texteingabe",
};

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  questionType,
  initialData,
}) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | string | undefined>(undefined);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [percentageError, setPercentageError] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setImage(initialData.image || undefined);
      setAnswers(initialData.answers);
      setPercentageError(initialData.percentageError || 0);
    } else {
      setText("");
      setImage(undefined);
      setPercentageError(0);
      setAnswers(
        questionType === "single" || questionType === "multiple"
          ? [
              { id: "1", text: "", score: 0 },
              { id: "2", text: "", score: 0 },
            ]
          : [{ id: "1", text: "", score: 1 }]
      );
    }
  }, [initialData, questionType]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setImage(file);
    }
  };

  const handleAnswerChange = (
    index: number,
    field: keyof Answer,
    value: string | number
  ) => {
    setAnswers((prev) =>
      prev.map((answer, i) =>
        i === index
          ? { ...answer, [field]: field === "score" ? Number(value) : value }
          : answer
      )
    );

    if (questionType === "single" && field === "score" && Number(value) > 0) {
      setAnswers((prev) =>
        prev.map((answer, i) => ({
          ...answer,
          score: i === index ? Number(value) : 0,
        }))
      );
    }
  };

  const handleAddAnswer = () => {
    setAnswers((prev) => [
      ...prev,
      { id: (prev.length + 1).toString(), text: "", score: 0 },
    ]);
  };

  const handleRemoveAnswer = (index: number) => {
    if (
      (questionType === "number" || questionType === "text") &&
      answers.length <= 1
    )
      return;
    setAnswers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Fragetext darf nicht leer sein.");
      return;
    }

    if (
      (questionType === "single" || questionType === "multiple") &&
      answers.length < 2
    ) {
      setError("Mindestens zwei Antwortoptionen erforderlich.");
      return;
    }

    if (questionType === "text" && !percentageError) {
      setPercentageError(0);
    }

    setError(null);
    onSave({ text, type: questionType, image, answers, percentageError });
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData
            ? `${questionTypeLabels[questionType]} bearbeiten`
            : `Neue Frage: ${questionTypeLabels[questionType]}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="questionText">
            <Form.Label>Fragetext</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="questionImage" className="mt-3">
            <Form.Label>Bild hochladen (optional)</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>

          {(questionType === "single" || questionType === "multiple") && (
            <div className="mt-3">
              <Form.Label>Antworten</Form.Label>
              <div className="d-flex mb-2">
                <div className="flex-grow-1">Antwort</div>
                <div style={{ width: "80px", textAlign: "center" }}>Punkte</div>
              </div>
              {answers.map((answer, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(index, "text", e.target.value)
                    }
                  />
                  <Form.Control
                    type="number"
                    min={0}
                    value={answer.score}
                    onChange={(e) =>
                      handleAnswerChange(index, "score", Number(e.target.value))
                    }
                    style={{ width: "80px" }}
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveAnswer(index)}
                  >
                    ✖
                  </Button>
                </div>
              ))}
              <Button variant="outline-primary" onClick={handleAddAnswer}>
                + Antwort hinzufügen
              </Button>
            </div>
          )}

          {questionType === "number" && (
            <Form.Group controlId="numberAnswer" className="mt-3">
              <Form.Label>Richtige Antwort (Zahl)</Form.Label>
              <Form.Control
                type="number"
                value={answers[0]?.text || ""}
                onChange={(e) =>
                  setAnswers([{ id: "1", text: e.target.value, score: 1 }])
                }
              />
            </Form.Group>
          )}

          {questionType === "text" && (
            <>
              <Form.Group controlId="textAnswer" className="mt-3">
                <Form.Label>Richtige Antwort</Form.Label>
                <Form.Control
                  type="text"
                  value={answers[0]?.text || ""}
                  onChange={(e) =>
                    setAnswers([{ id: "1", text: e.target.value, score: 1 }])
                  }
                />
              </Form.Group>
              <Form.Group controlId="percentageError" className="mt-3">
                <Form.Label>Fehlertoleranz (%)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  value={percentageError}
                  onChange={(e) => setPercentageError(Number(e.target.value))}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Hinzufügen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
