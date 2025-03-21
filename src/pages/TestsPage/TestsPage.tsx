import { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmActionModal,
  Loader,
  AlertMessage,
  TestList,
} from "../../components";
import { useTests } from "../../hooks";
import { Group } from "../../types/reduxTypes";
import { useAppDispatch } from "../../hooks";
import { changeTestStatus } from "../../redux/test/testActions";

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
    setSelectedTest,
    currentTest,
    handleGroupChange,
    applyGroupChanges,
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

  const handleCopyClick = useCallback((testId: string) => {
    setCopyTestId(testId);
  }, []);

  const confirmCopyTest = useCallback(async () => {
    if (copyTestId) {
      await copyExistingTest(copyTestId);
      setCopyTestId(null);
    }
  }, [copyTestId, copyExistingTest]);

  const closeCopyModal = useCallback(() => {
    setCopyTestId(null);
  }, []);

  const handleEditClick = useCallback((testId: string, title: string) => {
    setEditTestId(testId);
    setEditValue(title);
  }, []);

  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editValue.trim();
    if (editTestId && trimmedTitle) {
      updateExistingTest(editTestId, { title: trimmedTitle });
      if (currentTest?.id === editTestId) {
        setSelectedTest({ ...currentTest, title: trimmedTitle });
      }
      setEditTestId(null);
      setEditValue("");
    }
  }, [editTestId, editValue, updateExistingTest, currentTest, setSelectedTest]);

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
              onCopy={handleCopyClick}
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
