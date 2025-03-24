import { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmActionModal,
  Loader,
  AlertMessage,
  TestList,
} from "../../components";
import { useTests, useAppDispatch } from "../../hooks";
import { Group, QuestionPayload, Test } from "../../types/reduxTypes";
import { changeTestStatus } from "../../redux";

export const TestsPage: React.FC = () => {
  const {
    tests,
    allGroups,
    selectedGroups,
    loading,
    error,
    deleteExistingTest,
    copyExistingTest,
    updateExistingTest,
    fetchAllTests,
    fetchAllGroupsList,
    currentTest,
    handleGroupChange,
    applyGroupChanges,
    setSelectedTest,
  } = useTests();

  const dispatch = useAppDispatch();

  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [copyTestId, setCopyTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    if (tests.length === 0) fetchAllTests();
    if (allGroups.length === 0) fetchAllGroupsList();
  }, [fetchAllTests, fetchAllGroupsList, tests.length, allGroups.length]);

  const convertedAllGroups: Group[] = useMemo(
    () =>
      allGroups.map((g) => ({
        ...g,
        members: [],
        createdBy: "",
        createdAt: "",
      })),
    [allGroups]
  );

  const convertedSelectedGroups: Record<string, Group[]> = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selectedGroups).map(([testId, groups]) => [
          testId,
          groups.map((g) => ({
            ...g,
            members: [],
            createdBy: "",
            createdAt: "",
          })),
        ])
      ),
    [selectedGroups]
  );

  const handleDeleteClick = useCallback((testId: string) => {
    setDeleteTestId(testId);
  }, []);

  const confirmDeleteTest = useCallback(() => {
    if (deleteTestId) {
      deleteExistingTest(deleteTestId);
      setDeleteTestId(null);
    }
  }, [deleteTestId, deleteExistingTest]);

  const closeDeleteModal = useCallback(() => {
    setDeleteTestId(null);
  }, []);

  const confirmCopyTest = useCallback(async () => {
    if (copyTestId) {
      console.log("📦 Начинаем копирование теста с id:", copyTestId);
      try {
        const copiedTest = await copyExistingTest(copyTestId);
        console.log("✅ Копированный тест:", copiedTest);

        setSelectedTest(null);

        if (copiedTest?.id) {
          console.log("🔄 Обновляем список тестов...");
          await fetchAllTests();
          console.log("✅ Список тестов обновлён");
        }
      } catch (err) {
        console.error("❌ Ошибка при копировании теста:", err);
      } finally {
        setCopyTestId(null);
        console.log("📦 Завершили копирование, закрыли модалку");
      }
    }
  }, [copyTestId, copyExistingTest, fetchAllTests, setSelectedTest]);

  const closeCopyModal = useCallback(() => {
    setCopyTestId(null);
  }, []);

  const handleEditClick = useCallback((testId: string, title: string) => {
    setEditTestId(testId);
    setEditValue(title);
  }, []);

  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editValue.trim();
    if (editTestId && trimmedTitle && currentTest) {
      const toQuestionType = (
        type: string
      ): QuestionPayload["questionType"] => {
        if (["single", "multiple", "number", "text"].includes(type)) {
          return type as QuestionPayload["questionType"];
        }
        return "single";
      };

      const questionPayloads = currentTest.questions.map((q) => ({
        questionText: q.text,
        questionType: toQuestionType(q.type),
        imageUrl: typeof q.image === "string" ? q.image : null,
        percentageError: q.percentageError,
        answers: q.answers.map((a) => ({
          text: a.text,
          score: a.score,
          isCorrect: a.score > 0,
        })),
      }));

      updateExistingTest(editTestId, {
        title: trimmedTitle,
        description: currentTest.description,
        timeLimit: currentTest.timeLimit,
        questions: questionPayloads,
        maximumMarks: currentTest.maximumMarks,
        minimumScores: currentTest.minimumScores,
        availableForGroups: currentTest.availableForGroups.map((g) => g.id),
        status: currentTest.status,
      });

      setEditTestId(null);
      setEditValue("");
    }
  }, [editTestId, editValue, updateExistingTest, currentTest]);

  const handleApplyGroupChanges = useCallback(
    (testId: string) => {
      if (testId && selectedGroups[testId]) {
        applyGroupChanges(testId);
      }
    },
    [applyGroupChanges, selectedGroups]
  );

  const handleToggleStatus = useCallback(
    (testId: string, currentStatus: "active" | "inactive") => {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      dispatch(changeTestStatus({ testId, status: newStatus }));
    },
    [dispatch]
  );

  const handleCopyAndReturn = useCallback(
    async (testId: string): Promise<Test | undefined> => {
      try {
        const copiedTest = await copyExistingTest(testId);
        if (copiedTest?.id) {
          await fetchAllTests();
        }
        return copiedTest;
      } catch {
        return undefined;
      }
    },
    [copyExistingTest, fetchAllTests]
  );

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Tests:</h2>

          {loading ? (
            <Loader size="md" />
          ) : error ? (
            <AlertMessage message="Fehler beim Laden der Tests" type="danger" />
          ) : tests.length === 0 ? (
            <p className="text-center mt-4">Keine Tests verfügbar.</p>
          ) : (
            <TestList
              tests={tests}
              allGroups={convertedAllGroups}
              selectedGroups={convertedSelectedGroups}
              editTestId={editTestId}
              editValue={editValue}
              onEdit={handleEditClick}
              onSave={handleSaveEdit}
              onCancel={() => setEditTestId(null)}
              setEditValue={setEditValue}
              onDelete={handleDeleteClick}
              onCopy={handleCopyAndReturn}
              handleGroupChange={handleGroupChange}
              applyGroupChanges={handleApplyGroupChanges}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </Col>
      </Row>

      {deleteTestId && (
        <ConfirmActionModal
          show
          title="Test löschen"
          message="Sind Sie sicher, dass Sie diesen Test löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          confirmVariant="danger"
          onConfirm={confirmDeleteTest}
          onClose={closeDeleteModal}
        />
      )}

      {copyTestId && (
        <ConfirmActionModal
          show
          title="Test kopieren"
          message="Sind Sie sicher, dass Sie diesen Test kopieren möchten?"
          confirmText="Kopieren"
          confirmVariant="primary"
          onConfirm={confirmCopyTest}
          onClose={closeCopyModal}
        />
      )}
    </Container>
  );
};
