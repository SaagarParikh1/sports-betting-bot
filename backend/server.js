import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI();

const API_KEY = process.env.ODDS_API_KEY;
const REGION = "us";

const SPORTS_MAP = {
  NFL: "americanfootball_nfl",
  NBA: "basketball_nba",
  MLB: "baseball_mlb",
  PGA: "golf_pga",
  Soccer: "soccer_epl"
};

app.get("/", (req, res) => {
  res.send("Sports Betting Bot Backend (Node.js) is running!");
});

app.get("/predict/:sport", async (req, res) => {
  const sport = req.params.sport.toUpperCase();
  const sportKey = SPORTS_MAP[sport];

  if (!sportKey) {
    return res.json({ available: false, picks: [] });
  }

  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?regions=${REGION}&apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  const predictions = [];
  data.forEach(game => {
    const homeTeam = game.home_team;
    const bookmakers = game.bookmakers;
    if (!bookmakers || bookmakers.length === 0) return;

    const outcomes = bookmakers[0].markets[0].outcomes;
    const homeOutcome = outcomes.find(outcome => outcome.name === homeTeam);

    if (homeOutcome) {
      const homeOdds = homeOutcome.price;
      const impliedProb = 1 / homeOdds;
      predictions.push({
        home_team: homeTeam,
        home_odds: homeOdds,
        implied_prob: impliedProb
      });
    }
  });

  res.json({
    available: predictions.length > 0,
    picks: predictions
  });
});

app.post("/ask-openai", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a sports betting expert." },
      { role: "user", content: prompt }
    ]
  });

  res.json({
    response: response.choices[0].message.content
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
