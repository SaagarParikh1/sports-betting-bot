import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import SportSection from "./components/SportSection";
import OpenAIAssistant from "./components/OpenAIAssistant";
import logo from "./images/logoSBB.png";
import "./App.css";



function App() {
  const [key, setKey] = useState("NFL");

  return (
    <Container className="my-4">
      <div className="text-center mb-4">
         <img src={logo} alt="Sports Betting Bot Logo" className="img-fluid" style={{ maxWidth: "500px" }} />
      </div>


      <Tabs
        id="sports-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 justify-content-center"
      >
        <Tab eventKey="NFL" title="NFL"></Tab>
        <Tab eventKey="NBA" title="NBA"></Tab>
        <Tab eventKey="MLB" title="MLB"></Tab>
        <Tab eventKey="PGA" title="PGA"></Tab>
        <Tab eventKey="Soccer" title="Soccer"></Tab>
      </Tabs>

      <SportSection sport={key} />
      <OpenAIAssistant />
    </Container>
  );
}

export default App;
