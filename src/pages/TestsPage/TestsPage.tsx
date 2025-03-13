import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmDeleteModal,
  Loader,
  AlertMessage,
  TestList,
} from "../../components";
import { useTests } from "../../hooks";

export const TestsPage: React.FC = () => {
  const {
    tests,
    allGroups,
    loading,
    error,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
    updateExistingTest,
    fetchAllTests,
    fetchGroups,
    setSelectedTest,
    currentTest,
  } = useTests();

  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  /// 🔄 **Загрузка тестов при монтировании**
  useEffect(() => {
    if (!tests.length && !loading) {
      console.warn("📡 [TestsPage] Lade Tests...");
      fetchAllTests();
    }
  }, [fetchAllTests, tests.length, loading]); // ✅ Добавили `loading`

  /// 🔄 **Загрузка групп при изменении `currentTest`**
  useEffect(() => {
    if (!currentTest?.id) return; // ✅ Защита от `null`
    console.warn(`📡 [TestsPage] Lade Gruppen für Test ${currentTest.id}...`);
    fetchGroups(currentTest.id);
  }, [fetchGroups, currentTest?.id]);

  /// ❌ **Открытие модального окна удаления**
  const handleDeleteClick = useCallback((testId: string) => {
    console.warn(`📡 [TestsPage] Öffne Lösch-Modal für Test ${testId}`);
    setDeleteTestId(testId);
  }, []);

  /// ✅ **Подтверждение удаления**
  const confirmDeleteTest = useCallback(() => {
    if (deleteTestId) {
      console.warn(`📡 [TestsPage] Lösche Test ${deleteTestId}...`);
      deleteExistingTest(deleteTestId);
      setDeleteTestId(null);
    }
  }, [deleteTestId, deleteExistingTest]);

  /// ❌ **Закрытие модального окна удаления**
  const closeDeleteModal = useCallback(() => {
    console.warn("📡 [TestsPage] Schließe Lösch-Modal");
    setDeleteTestId(null);
  }, []);

  /// ✍️ **Начало редактирования теста**
  const handleEditClick = useCallback((testId: string, title: string) => {
    console.warn(`📡 [TestsPage] Bearbeite Test ${testId}`);
    setEditTestId(testId);
    setEditValue(title);
  }, []);

  /// 💾 **Сохранение изменений в тесте**
  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editValue.trim();
    if (editTestId && trimmedTitle) {
      console.warn(
        `📡 [TestsPage] Speichere Änderungen für Test ${editTestId}`
      );
      updateExistingTest(editTestId, { title: trimmedTitle });

      // 🔥 Сначала обновляем `currentTest`, если он редактируется
      if (currentTest?.id === editTestId) {
        console.warn(`📡 [TestsPage] Aktualisiere currentTest`);
        setSelectedTest({ ...currentTest, title: trimmedTitle });
      }

      // ✅ Только после обновления сбрасываем `editTestId`
      setEditTestId(null);
      setEditValue("");
    }
  }, [editTestId, editValue, updateExistingTest, currentTest, setSelectedTest]);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center" aria-label="Überschrift für Tests">
            Tests:
          </h2>

          {loading ? (
            <Loader size="md" />
          ) : error ? (
            <AlertMessage message="Fehler beim Laden der Tests" type="danger" />
          ) : tests.length === 0 ? (
            <p className="text-center mt-4">Keine Tests verfügbar.</p>
          ) : (
            <TestList
              tests={tests}
              allGroups={allGroups}
              editTestId={editTestId}
              editValue={editValue}
              onEdit={handleEditClick}
              onSave={handleSaveEdit}
              onCancel={() => setEditTestId(null)}
              setEditValue={setEditValue}
              onDelete={handleDeleteClick}
              onCopy={copyExistingTest}
              onUpdateGroups={updateTestGroupAccess}
            />
          )}
        </Col>
      </Row>

      {deleteTestId && (
        <ConfirmDeleteModal
          show={!!deleteTestId}
          title="Test löschen"
          message="Sind Sie sicher, dass Sie diesen Test löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          onDelete={confirmDeleteTest}
          onClose={closeDeleteModal}
          aria-label="Test löschen Modal"
        />
      )}
    </Container>
  );
};
