// src/pages/TestAttemptPage/TestAttemptPage.tsx

import { FC } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { useTestAttempt } from "../../hooks";
import { AnswerOption } from "../../types/apiTypes";

const formatTime = (seconds: number) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export const TestAttemptPage: FC = () => {
  const {
    
    questions,
    answers,
    setAnswer,
    submit,
    loading,
    result,
    timeLeft,
    isTimeUp,
    isSubmitting,
  } = useTestAttempt();

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          {/* Загрузка */}
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          ) : result ? (
            <>
              <h3 className="mb-3 text-center">Testergebnis</h3>
              <p className="text-center">
                Sie haben den Test mit{" "}
                <strong>{Math.round(result.percentageScore)}%</strong>{" "}
                abgeschlossen.
              </p>
              <p className="text-center">
                Ihre Note: <strong>{result.grade}</strong>
              </p>
            </>
          ) : (
            <>
              <Row className="mb-4">
                <Col>
                  <h2>Test absolvieren</h2>
                </Col>
                <Col className="text-end">
                  <h5>Zeit: {formatTime(timeLeft)}</h5>
                </Col>
              </Row>

              {questions.map((q, index) => (
                <Card className="mb-4" key={q.id}>
                  <Card.Body>
                    <Card.Title>
                      {index + 1}. {q.questionText}
                    </Card.Title>

                    {q.imageUrl && (
                      <img
                        src={q.imageUrl}
                        alt="Fragebild"
                        style={{ maxWidth: "100%", marginBottom: "1rem" }}
                      />
                    )}

                    {/* Single choice */}
                    {q.type === "single-choice" && q.answers?.length && (
                      <Form>
                        {q.answers.map((a: AnswerOption) => (
                          <Form.Check
                            type="radio"
                            key={a.id}
                            name={q.id}
                            label={a.text}
                            checked={answers[q.id] === a.id}
                            onChange={() => setAnswer(q.id, a.id)}
                          />
                        ))}
                      </Form>
                    )}

                    {/* Multiple choice */}
                    {q.type === "multiple-choice" && q.answers?.length && (
                      <Form>
                        {q.answers.map((a: AnswerOption) => {
                          const current = (answers[q.id] || []) as string[];
                          const checked = current.includes(a.id);
                          const updated = checked
                            ? current.filter((id) => id !== a.id)
                            : [...current, a.id];

                          return (
                            <Form.Check
                              key={a.id}
                              type="checkbox"
                              label={a.text}
                              checked={checked}
                              onChange={() => setAnswer(q.id, updated)}
                            />
                          );
                        })}
                      </Form>
                    )}

                    {/* Number input */}
                    {q.type === "number-input" && (
                      <Form.Control
                        type="number"
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                      />
                    )}

                    {/* Text input */}
                    {q.type === "text-input" && (
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                      />
                    )}
                  </Card.Body>
                </Card>
              ))}

              <div className="text-center mb-5">
                <Button
                  variant="success"
                  size="lg"
                  onClick={submit}
                  disabled={isSubmitting || isTimeUp}
                >
                  {isSubmitting ? "Speichern..." : "Test abschließen"}
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
