import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Carousel, Loader, AlertMessage } from "../../components";
import { useTestResults } from "../../hooks";
import { useSelector } from "react-redux";
import { selectAllTest } from "../../redux";

interface ParticipantResult {
  userId: string;
  userName: string;
  hasPassed: boolean;
  startTime: string | null;
  timeTaken: number | null;
  maximumMarks: number;
  obtainedMarks: number;
  percentageScore: number;
  grade: string | null;
}

export const TestResultsPage: React.FC = () => {
  const {
    isLoading,
    error,
    selectedTestId,
    selectedGroupId,
    groups,
    participants,
    handleSelectTest,
    handleSelectGroup,
  } = useTestResults();

  const allTests = useSelector(selectAllTest);

  useEffect(() => {
    if (selectedTestId && groups.length > 0 && !selectedGroupId) {
      handleSelectGroup(groups[0].groupId);
    }
  }, [selectedTestId, groups, selectedGroupId, handleSelectGroup]);

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-4 text-center">Testergebnisse</h2>

          {isLoading ? (
            <div className="text-center">
              <Loader size="md" />
            </div>
          ) : error ? (
            <AlertMessage
              message="Fehler beim Laden der Testergebnisse."
              type="danger"
              onClose={() => null}
            />
          ) : (
            <>
              {/* 🔹 Карусель тестов */}
              <Carousel
                items={allTests.map((t) => ({
                  id: t.id,
                  name: t.title,
                }))}
                selectedItemId={selectedTestId ?? ""}
                onSelect={handleSelectTest}
              />

              {/* 🔹 Карусель групп */}
              {groups.length > 0 && (
                <Carousel
                  items={groups.map((g) => ({
                    id: g.groupId,
                    name: g.groupName,
                  }))}
                  selectedItemId={selectedGroupId ?? ""}
                  onSelect={handleSelectGroup}
                />
              )}

              {/* 🔹 Список участников */}
              {participants.length > 0 ? (
                <div className="mt-4">
                  <ul className="list-group">
                    {(participants as ParticipantResult[]).map((p, index) => (
                      <li
                        key={p.userId}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span className="fs-5">
                          {index + 1}. {p.userName || "Unbekannter Benutzer"}
                        </span>
                        <span className="text-muted  text-end">
                          {p.hasPassed ? (
                            <>
                              ✅ Durchgeführt: {p.startTime} | ⏱ {p.timeTaken}{" "}
                              Min. | 🎯 {p.obtainedMarks}/{p.maximumMarks} | 📊{" "}
                              {Math.round(p.percentageScore)}% | 🎓 {p.grade}
                            </>
                          ) : (
                            <>🔴 Nicht durchgeführt</>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-center mt-4">
                  Keine Teilnehmer in dieser Gruppe.
                </p>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
