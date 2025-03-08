import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmDeleteModal,
  Loader,
  AlertMessage,
  TestList,
} from "../../components";
import { useTests } from "../../hooks";
import { useAppDispatch } from "../../hooks"; 
import { updateTest } from "../../redux";

export const TestsPage: React.FC = () => {
  const dispatch = useAppDispatch(); 
  const {
    tests = [],
    loading,
    error,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
  } = useTests();

  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  /// Открываем модалку удаления теста
  const handleDeleteClick = (testId: string) => setDeleteTestId(testId);

  ///  Подтверждаем удаление теста
  const confirmDeleteTest = () => {
    if (deleteTestId) {
      deleteExistingTest(deleteTestId);
      setDeleteTestId(null);
    }
  };

  ///  Закрытие модалки удаления теста
  const closeDeleteModal = () => setDeleteTestId(null);

  ///  Начать редактирование теста
  const handleEditClick = (testId: string, title: string) => {
    setEditTestId(testId);
    setEditValue(title);
  };

  ///  Сохранить изменения теста
  const handleSaveEdit = () => {
    if (editTestId && editValue.trim()) {
      dispatch(updateTest({ testId: editTestId, data: { title: editValue } })); 
      setEditTestId(null);
    }
  };

  ///  Отмена редактирования
  const handleCancelEdit = () => setEditTestId(null);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Tests:</h2>

          {loading ? (
            <Loader size="md" />
          ) : error ? (
            <AlertMessage
              message="Fehler beim Laden der Tests"
              type="danger"
              onClose={() => {}}
            />
          ) : tests.length === 0 ? (
            <p className="text-center mt-4">🔍 Keine Tests verfügbar.</p>
          ) : (
            <TestList
              tests={tests}
              editTestId={editTestId}
              editValue={editValue}
              onEdit={handleEditClick}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
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
