from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import requests

app = Flask(__name__)
CORS(app)

import os
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


SPORTS_MAP = {
    "NFL": "americanfootball_nfl",
    "NBA": "basketball_nba",
    "MLB": "baseball_mlb",
    "PGA": "golf_pga",
    "Soccer": "soccer_epl"
}

@app.route("/")
def home():
    return "Sports Betting Bot Backend"

@app.route("/predict/<sport>", methods=["GET"])
def predict_sport(sport):
    sport_key = SPORTS_MAP.get(sport.upper())
    if not sport_key:
        return jsonify({"available": False, "picks": []})

    url = f"https://api.the-odds-api.com/v4/sports/{sport_key}/odds/?regions={REGION}&apiKey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    predictions = []
    for game in data:
        home_team = game["home_team"]
        markets = game["bookmakers"][0]["markets"][0]["outcomes"]
        for outcome in markets:
            if outcome["name"] == home_team:
                home_odds = outcome["price"]
                implied_prob = 1 / home_odds
                predictions.append({
                    "home_team": home_team,
                    "home_odds": home_odds,
                    "implied_prob": implied_prob
                })

    if predictions:
        return jsonify({"available": True, "picks": predictions})
    else:
        return jsonify({"available": False, "picks": []})

@app.route("/ask-openai", methods=["POST"])
def ask_openai():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a sports betting expert."},
            {"role": "user", "content": prompt}
        ]
    )
    return jsonify({"response": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)