import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Question, Answer } from "../../../types/reduxTypes";

interface QuestionModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (questionData: Omit<Question, "id">) => void;
  initialData?: Question | null;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  show,
  onHide,
  onSave,
  initialData,
}) => {
  const [text, setText] = useState<string>("");
  const [type, setType] = useState<Question["type"]>("single");
  const [image, setImage] = useState<string | File | undefined>(undefined);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setType(initialData.type);
      setImage(initialData.image);
      setAnswers(initialData.answers);
    } else {
      setText("");
      setType("single");
      setImage(undefined);
      setAnswers([
        { id: "", text: "", score: 0 },
        { id: "", text: "", score: 0 },
      ]);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleAnswerChange = (
    index: number,
    field: keyof Answer,
    value: string | number
  ) => {
    setAnswers((prev) =>
      prev.map((answer, i) =>
        i === index ? { ...answer, [field]: value } : answer
      )
    );
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: "", text: "", score: 0 }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSave({ text, type, image, answers });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Frage bearbeiten" : "Neue Frage"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

          <Form.Group controlId="questionType" className="mt-3">
            <Form.Label>Fragetyp</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value as Question["type"])}
            >
              <option value="single">Einfachauswahl</option>
              <option value="multiple">Mehrfachauswahl</option>
              <option value="number">Zahleneingabe</option>
              <option value="text">Texteingabe</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="questionImage" className="mt-3">
            <Form.Label>Bild hochladen (optional)</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>

          <div className="mt-3">
            <Form.Label>Antworten</Form.Label>
            {answers.map((answer, index) => (
              <InputGroup key={index} className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Antwort eingeben"
                  value={answer.text}
                  onChange={(e) =>
                    handleAnswerChange(index, "text", e.target.value)
                  }
                />
                {(type === "single" || type === "multiple") && (
                  <Form.Control
                    type="number"
                    min={0}
                    value={answer.score}
                    onChange={(e) =>
                      handleAnswerChange(index, "score", Number(e.target.value))
                    }
                  />
                )}
                <Button
                  variant="danger"
                  onClick={() => handleRemoveAnswer(index)}
                >
                  ✖
                </Button>
              </InputGroup>
            ))}
            <Button variant="outline-primary" onClick={handleAddAnswer}>
              + Antwort hinzufügen
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Speichern
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionModal;
