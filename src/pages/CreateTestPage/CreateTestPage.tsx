import { useState, useEffect, useMemo } from "react";
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
import { selectUser } from "../../redux/auth/authSelectors";
import {
  Loader,
  AlertMessage,
  QuestionList,
  ConfirmActionModal,
} from "../../components";
import { Test, Question } from "../../types/reduxTypes";
import { SideNavController } from "../../controllers";

export const CreateTestPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedTest = useSelector(selectSelectedTest);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);
  const user = useSelector(selectUser);

  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testTimeLimit, setTestTimeLimit] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  
  const defaultMinimumScores = useMemo(
    () => ({
      1: 95,
      2: 80,
      3: 70,
      4: 50,
      5: 0, 
    }),
    []
  );

  
  const [minimumScores, setMinimumScores] =
    useState<Record<number, number>>(defaultMinimumScores);

  useEffect(() => {
    if (selectedTest) {
      setTestTitle(selectedTest.title);
      setTestDescription(selectedTest.description);
      setTestTimeLimit(selectedTest.timeLimit);
      setQuestions(selectedTest.questions);
      setMinimumScores(selectedTest.minimumScores || defaultMinimumScores);
    }
  }, [selectedTest, defaultMinimumScores]);

  
  const maximumMarks = questions.reduce(
    (sum, q) => sum + q.answers.reduce((s, a) => s + a.score, 0),
    0
  );

  const handleSaveTest = () => {
    if (
      !testTitle.trim() ||
      !testDescription.trim() ||
      questions.length === 0 ||
      Object.values(minimumScores).some((score) => score < 0 || score > 100) ||
      !user
    )
      return;

    const testData: Omit<Test, "id" | "createdAt"> & {
      userId: string;
      role: number;
    } = {
      title: testTitle,
      description: testDescription,
      timeLimit: testTimeLimit,
      availableForGroups: [],
      questions,
      maximumMarks,
      status: "inactive",
      minimumScores,
      author: { id: user._id, username: user.username },
      userId: user._id,
      role: user.role,
    };

    if (selectedTest) {
      dispatch(editTest({ testId: selectedTest.id, testData }));
    } else {
      dispatch(addTest(testData));
    }

    navigate("/admin/tests/create");
  };

  
  const handleMinimumScoreChange = (grade: number, value: number) => {
    setMinimumScores((prevScores) => ({
      ...prevScores,
      [grade]: value,
    }));
  };

  return (
    <Container fluid>
      <SideNavController
        onAddQuestion={(questionData) => {
          setQuestions([
            ...questions,
            { id: (questions.length + 1).toString(), ...questionData },
          ]);
        }}
      />

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

            <h3 className=" text-center mt-5 mb-3">Fragen:</h3>

            {questions.length > 0 ? (
              <QuestionList
                questions={questions}
                onSave={(id, updatedQuestion) => {
                  setQuestions((prev) =>
                    prev.map((q) => (q.id === id ? updatedQuestion : q))
                  );
                }}
                onDelete={(id) =>
                  setQuestions((prev) => prev.filter((q) => q.id !== id))
                }
              />
            ) : (
              <p className="text-center text-muted">
                Keine Fragen hinzugefügt.
              </p>
            )}

            <h5 className="mt-4">Einstellungen für Testergebnisse</h5>

            <Form.Group className="mb-3">
              <Form.Label>Maximale Punktzahl</Form.Label>
              <Form.Control type="number" value={maximumMarks} disabled />
            </Form.Group>

            {[1, 2, 3, 4, 5].map((grade) => (
              <Form.Group className="mb-3" key={grade}>
                <Form.Label>Mindestprozentsatz für Note {grade}</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  value={minimumScores[grade] || 0}
                  onChange={(e) =>
                    handleMinimumScoreChange(grade, Number(e.target.value))
                  }
                />
              </Form.Group>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/admin/tests/create")}
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowConfirmModal(true)}
                disabled={Object.values(minimumScores).some(
                  (score) => score < 0 || score > 100
                )}
              >
                Test speichern
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <ConfirmActionModal
        show={showConfirmModal}
        title="Test speichern"
        message="Sie haben alle Fragen hinzugefügt. Möchten Sie die Testeinstellungen abschließen?"
        confirmText="Speichern"
        confirmVariant="primary"
        onConfirm={() => {
          handleSaveTest();
          setShowConfirmModal(false);
        }}
        onClose={() => setShowConfirmModal(false)}
      />
    </Container>
  );
};
