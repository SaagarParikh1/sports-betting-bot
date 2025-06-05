import React, { useState } from "react";
import { Card, Button, Spinner, Row, Col } from "react-bootstrap";

const SportSection = ({ sport }) => {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPicks = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:5000/predict/${sport}`);
    const data = await response.json();
    setLoading(false);

    if (!data.available) {
      setMessage("No picks available.");
      setPicks([]);
    } else {
      setPicks(data.picks);
      setMessage("");
    }
  };

  return (
    <section className="my-4">
      <h2 className="text-secondary">{sport} Picks</h2>
      <Button onClick={loadPicks} variant="primary" className="mb-3">
        {loading ? <Spinner animation="border" size="sm" /> : "Load Picks"}
      </Button>
      {message && <p className="text-muted">{message}</p>}
      <Row>
        {picks.map((pick, index) => (
          <Col md={6} key={index}>
            <Card className="mb-3 shadow-sm">
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
    </section>
  );
};

export default SportSection;
