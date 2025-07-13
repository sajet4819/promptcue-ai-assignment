const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();
console.log("API KEY:", process.env.TOGETHER_API_KEY);
const app = express();
app.use(express.json());

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const PORT = process.env.PORT || 3000;

const MODEL_MAP = {
  gptj: "mistralai/Mistral-7B-Instruct-v0.2",     // replaces GPT-J
  mistral: "mistralai/Mistral-7B-Instruct-v0.2"   // same model, just two routes
};

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  const model = req.query.model || "mistral";

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const modelName = MODEL_MAP[model.toLowerCase()];
  if (!modelName) {
    return res.status(400).json({ error: "Model must be 'gptj' or 'mistral'." });
  }

  const headers = {
    Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    "Content-Type": "application/json"
  };

  const payload = {
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  };

  const startTime = Date.now();

  try {
    const response = await axios.post(TOGETHER_API_URL, payload, { headers });
    const reply = response.data.choices[0].message.content;
    const latency = Date.now() - startTime;

    const log = {
      timestamp: new Date().toISOString(),
      model,
      prompt,
      response: reply,
      latency_ms: latency,
      prompt_tokens: prompt.split(/\s+/).length,
      response_tokens: reply.split(/\s+/).length
    };

    const logPath = path.join(__dirname, "logs", "log.json");
    fs.appendFileSync(logPath, JSON.stringify(log) + "\n");

    res.json({ reply, latency_ms: latency });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: "Error calling model API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
