import { Container, Row, Col } from "react-bootstrap";
import {
  ConfirmActionModal,
  Loader,
  AlertMessage,
  ItemList,
} from "../../components";
import { useAvailableTests } from "../../hooks";
import { FaArrowRightToBracket, FaLock } from "react-icons/fa6";

export const AvailableTests: React.FC = () => {
  const {
    tests,
    isLoading,
    error,
    confirmTestId,
    openConfirmModal,
    closeConfirmModal,
    startTest,
  } = useAvailableTests();

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-3 text-center">Verfügbare Tests:</h2>

          {isLoading ? (
            <div className="text-center">
              <Loader size="md" />
            </div>
          ) : error ? (
            <AlertMessage
              message="Fehler beim Laden der verfügbaren Tests."
              type="danger"
              onClose={closeConfirmModal}
            />
          ) : tests.length > 0 ? (
            <ItemList
              items={tests.map((test) => ({
                id: test._id,
                name: test.title,
                icon:
                  test.status === "active" ? (
                    <FaArrowRightToBracket className="icon" />
                  ) : (
                    <FaLock className="icon" />
                  ),
                iconTitle: test.status === "active" ? "Zum Test" : "Inaktiv",
                iconColor: test.status === "active" ? "success" : "secondary",
                onIconClick:
                  test.status === "active"
                    ? () => openConfirmModal(test._id)
                    : undefined,
              }))}
            />
          ) : (
            <p className="text-center mt-4">Keine verfügbaren Tests.</p>
          )}
        </Col>
      </Row>

      {confirmTestId && (
        <ConfirmActionModal
          show={!!confirmTestId}
          title="Test starten"
          message="Sind Sie sicher, dass Sie den Test starten möchten?"
          confirmText="Starten"
          confirmVariant="success"
          onConfirm={startTest}
          onClose={closeConfirmModal}
          aria-label="Test starten Modal"
        />
      )}
    </Container>
  );
};
