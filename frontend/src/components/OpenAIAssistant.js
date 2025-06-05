import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const OpenAIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const askQuestion = async () => {
    const res = await fetch("http://localhost:5000/ask-openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <section className="my-4">
      <h2 className="text-secondary">Ask the AI (Sports Q&A)</h2>
      <Form.Control
        type="text"
        placeholder="Ask a sports-related question"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="my-2"
      />
      <Button onClick={askQuestion} variant="success" className="mb-2">
        Ask
      </Button>
      {response && (
        <Card className="mt-3 shadow-sm">
          <Card.Body>
            <Card.Text>{response}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </section>
  );
};

export default OpenAIAssistant;
