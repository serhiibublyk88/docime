import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
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
import {  TestPayload, Question } from "../../types/reduxTypes";

import { SideNavController } from "../../controllers";
import { getTestById } from "../../redux";

export const CreateTestPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { testId } = useParams();

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
    if (testId) {
      dispatch(getTestById(testId));
    }
  }, [dispatch, testId]);

  useEffect(() => {
    if (selectedTest && testId) {
      setTestTitle(selectedTest.title);
      setTestDescription(selectedTest.description);
      setTestTimeLimit(selectedTest.timeLimit);
      setQuestions(selectedTest.questions);
      setMinimumScores(selectedTest.minimumScores || defaultMinimumScores);
    }
  }, [selectedTest, testId, defaultMinimumScores]);

  const maximumMarks = questions.reduce(
    (sum, q) => sum + q.answers.reduce((s, a) => s + a.score, 0),
    0
  );

const handleSaveTest = async () => {
  if (
    !testTitle.trim() ||
    !testDescription.trim() ||
    questions.length === 0 ||
    Object.values(minimumScores).some((score) => score < 0 || score > 100) ||
    !user
  ) {
    return;
  }

  const payload: TestPayload = {
    title: testTitle,
    description: testDescription,
    timeLimit: testTimeLimit,
    ...(testId ? {} : { availableForGroups: [] }),
    questions: questions.map((q) => q.id), // ✅ string[]
    maximumMarks: questions.reduce(
      (sum, q) => sum + q.answers.reduce((s, a) => s + a.score, 0),
      0
    ),
    status: "inactive",
    minimumScores,
    author: user._id,
  };

  try {
    if (testId) {
      await dispatch(editTest({ testId, testData: payload })).unwrap();
    } else {
      await dispatch(addTest(payload)).unwrap();
    }

    setShowConfirmModal(false);
    navigate("/admin/tests");
  } catch (error) {
    console.error("❌ Ошибка при сохранении:", error);
  }
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
          <h2 className="mb-3 text-center">
            {testId ? "Test bearbeiten" : "Test erstellen"}
          </h2>

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

            <h3 className="text-center mt-5 mb-3">Fragen:</h3>

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
                onClick={() => navigate("/admin/tests")}
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
        message="Möchten Sie die Änderungen speichern?"
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
