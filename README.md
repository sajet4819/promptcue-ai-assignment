# PromptCue AI Engineer Assignment – Node.js

This project is a minimal backend service to interact with open-source LLMs via Together.ai. Built using Node.js and Express.

---

## 🛠 Features

- Accepts a prompt via POST `/chat` endpoint
- Switches between models using `?model=gptj` or `?model=mistral`
- Uses Together.ai's hosted API
- Logs:
  - Model used
  - Prompt and response
  - Latency in ms
  - Token counts
- Logs are saved in `logs/log.json`

---

## 🔧 Tech Stack

- Node.js
- Express
- Axios
- Together.ai
- dotenv

---

## 🚀 How to Run

### 1. Clone the repo

```bash
git clone https://github.com/your-username/promptcue-ai-assignment.git
cd promptcue-ai-assignment
