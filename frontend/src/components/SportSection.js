import React, { useState } from "react";
import { Card, Button, Spinner, Row, Col, Form } from "react-bootstrap";

const SportSection = ({ sport }) => {
  const [picks, setPicks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  const loadPicks = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:5001/predict/${sport}`);
    const data = await response.json();
    setLoading(false);

    if (!data.available) {
      setMessage("No picks available.");
      setPicks([]);
    } else {
      setPicks(data.picks);
      setMessage("");
      setVisibleCount(10); // Reset to 10 when loading new picks
    }
  };

  const filteredPicks = picks.filter(pick =>
    pick.home_team.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="my-4">
      <h2 className="text-secondary">{sport} Picks</h2>

      <div className="d-flex align-items-center mb-2">
        <Button onClick={loadPicks} variant="primary" className="me-2">
          {loading ? <Spinner animation="border" size="sm" /> : "Load Picks"}
        </Button>
        <Form.Control
          type="text"
          placeholder="Filter by team name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      {message && <p className="text-muted">{message}</p>}

      <Row>
        {filteredPicks.slice(0, visibleCount).map((pick, index) => (
          <Col md={6} key={index}>
            <Card className="mb-3 shadow-sm custom-pick-card">
              <Card.Body>
                <Card.Title>{pick.home_team}</Card.Title>
                <Card.Text>Odds: {pick.home_odds}</Card.Text>
                <Card.Text>
                  Implied Probability: {(pick.implied_prob * 100).toFixed(2)}%
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < filteredPicks.length && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount(visibleCount + 10)}
          >
            Show More
          </Button>
        </div>
      )}
    </section>
  );
};

export default SportSection;
