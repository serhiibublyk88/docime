import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import {
  selectSelectedTest,
  selectTestLoading,
  selectTestError,
} from "../../redux/test/testSelectors";
import { addTest, editTest } from "../../redux/test/testActions";
import {
  Loader,
  AlertMessage,
  ItemList,
  QuestionModal,
} from "../../components";
import { Test, Question } from "../../types/reduxTypes";

export const CreateTestPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedTest = useSelector(selectSelectedTest);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);

  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testTimeLimit, setTestTimeLimit] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeQuestionType, setActiveQuestionType] = useState<
    Question["type"] | null
  >(null); // ✅ Храним активный тип вопроса

  useEffect(() => {
    if (selectedTest) {
      setTestTitle(selectedTest.title);
      setTestDescription(selectedTest.description);
      setTestTimeLimit(selectedTest.timeLimit);
      setQuestions(selectedTest.questions);
    }
  }, [selectedTest]);

  const handleSaveTest = () => {
    if (!testTitle.trim() || !testDescription.trim() || questions.length === 0)
      return;

    const testData: Omit<Test, "id" | "createdAt"> = {
      title: testTitle,
      description: testDescription,
      timeLimit: testTimeLimit,
      availableForGroups: [],
      questions,
      maximumMarks: questions.reduce(
        (sum, q) => sum + q.answers.reduce((s, a) => s + a.score, 0),
        0
      ),
      status: "inactive",
      minimumScores: {},
      author: { id: "user-id", username: "current-user" },
    };

    if (selectedTest) {
      dispatch(editTest({ testId: selectedTest.id, testData }));
    } else {
      dispatch(addTest(testData));
    }

    navigate("/tests");
  };

  const handleOpenQuestionModal = (type: Question["type"]) => {
    setActiveQuestionType(type); // ✅ Запоминаем тип вопроса
    setShowQuestionModal(true);
  };

  const handleAddQuestion = (questionData: Omit<Question, "id">) => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      ...questionData,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Test erstellen</h2>

          {loading && <Loader size="md" />}
          {error && <AlertMessage type="danger" message={error} />}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Testname</Form.Label>
              <Form.Control
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Beschreibung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dauer (Minuten)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={testTimeLimit}
                onChange={(e) => setTestTimeLimit(Number(e.target.value))}
              />
            </Form.Group>

            <h5 className="mt-4">Fragen</h5>

            {questions.length > 0 ? (
              <ItemList
                items={questions.map((q, index) => ({
                  id: q.id,
                  name: `${index + 1}. ${q.text}`,
                }))}
                onItemClick={() => {}}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onDelete={handleDeleteQuestion}
              />
            ) : (
              <p className="text-center text-muted">
                Keine Fragen hinzugefügt.
              </p>
            )}

            <h5 className="mt-4">Fragentypen</h5>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="outline-primary"
                onClick={() => handleOpenQuestionModal("single")}
              >
                Einzelauswahl hinzufügen
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleOpenQuestionModal("multiple")}
              >
                Mehrfachauswahl hinzufügen
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleOpenQuestionModal("number")}
              >
                Zahleneingabe hinzufügen
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleOpenQuestionModal("text")}
              >
                Texteingabe hinzufügen
              </Button>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate("/tests")}>
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveTest}
                disabled={questions.length === 0}
              >
                Test speichern
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {showQuestionModal && activeQuestionType && (
        <QuestionModal
          isOpen={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          onSave={handleAddQuestion}
          questionType={activeQuestionType}
        />
      )}
    </Container>
  );
};
