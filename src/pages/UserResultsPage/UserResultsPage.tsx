import { Container, Row, Col } from "react-bootstrap";
import { Loader, AlertMessage, ItemList } from "../../components";
import { useUserResults } from "../../hooks";
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaTrophy,
  FaChartBar,
  FaGraduationCap,
} from "react-icons/fa";

export const UserResultsPage: React.FC = () => {
  const { results, isLoading, showError, hideError } = useUserResults();

  return (
    <Container fluid>
      <Row className="align-items-start">
        <Col xs={12} md={8} lg={6} className="mx-auto mt-5">
          <h2 className="mb-4 text-center">Testergebnisse</h2>

          {isLoading ? (
            <div className="text-center">
              <Loader size="md" />
            </div>
          ) : showError ? (
            <AlertMessage
              message="Fehler beim Laden der Testergebnisse."
              type="danger"
              onClose={hideError}
            />
          ) : results.length > 0 ? (
            <ItemList
              items={results.map((result, index) => ({
                id: String(index),
                name: result.testTitle,
                additionalInfo: (
                  <div className="mt-1  text-secondary">
                    <FaRegCalendarAlt className="me-1" />
                    {result.startTime}
                    <FaRegClock className="ms-3 me-1" />
                    {result.timeTaken} Min.
                    <FaTrophy className="ms-3 me-1" />
                    {result.obtainedMarks} / {result.maximumMarks}
                    <FaChartBar className="ms-3 me-1" />
                    {Math.round(result.percentageScore)}%
                    <FaGraduationCap className="ms-3 me-1" />
                    {result.grade}
                  </div>
                ),
              }))}
              hideIcons
            />
          ) : (
            <p className="text-center mt-4">Keine Testergebnisse gefunden.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};
