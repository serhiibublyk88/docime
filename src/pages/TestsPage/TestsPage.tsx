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
    tests = [],
    allGroups = [],
    loading,
    error,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
    updateExistingTest,
    fetchAllTests, // ✅ Функция загрузки тестов
    fetchGroups, // ✅ Функция загрузки групп
  } = useTests();

  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  /// 🔄 **Оптимизированная загрузка тестов и групп при монтировании страницы**
  useEffect(() => {
    if (tests.length === 0) {
      fetchAllTests();
    }
    if (allGroups.length === 0) {
      fetchGroups();
    }
  }, [fetchAllTests, fetchGroups, tests.length, allGroups.length]);

  /// ❌ **Обработчик открытия модального окна удаления**
  const handleDeleteClick = useCallback((testId: string) => {
    setDeleteTestId(testId);
  }, []);

  /// ✅ **Подтверждение удаления**
  const confirmDeleteTest = useCallback(() => {
    if (deleteTestId) {
      deleteExistingTest(deleteTestId);
      setDeleteTestId(null);
    }
  }, [deleteTestId, deleteExistingTest]);

  /// ❌ **Закрытие модального окна удаления**
  const closeDeleteModal = useCallback(() => {
    setDeleteTestId(null);
  }, []);

  /// ✍️ **Начало редактирования теста**
  const handleEditClick = useCallback((testId: string, title: string) => {
    setEditTestId(testId);
    setEditValue(title);
  }, []);

  /// 💾 **Сохранение изменений в тесте**
  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editValue.trim();
    if (editTestId && trimmedTitle) {
      updateExistingTest(editTestId, { title: trimmedTitle });
      setEditTestId(null);
      setEditValue(""); // Очистка ввода
    }
  }, [editTestId, editValue, updateExistingTest]);

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
              allGroups={allGroups} // ✅ Передаем актуальные группы
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
        />
      )}
    </Container>
  );
};
