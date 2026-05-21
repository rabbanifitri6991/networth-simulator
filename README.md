# 💰 NetWorth Simulator

A full-stack personal finance simulator built with **Vue 3 + Express.js**.
Models compound growth across Malaysian asset classes — EPF, ASB, US ETFs, and crypto.

> Built as a portfolio project by Azrul — Data Engineer, KL Malaysia.

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Vue 3, Vite, Pinia, Vue Router      |
| Charts    | Chart.js + vue-chartjs              |
| Styling   | Tailwind CSS                        |
| Backend   | Express.js, Node.js                 |
| HTTP      | Axios                               |
| Hosting   | GitHub Pages (frontend)             |

---

## 📁 Project Structure

```
networth-simulator/
├── frontend/                  # Vue 3 app
│   ├── src/
│   │   ├── components/        # AssetCards, CompoundChart, ControlPanel...
│   │   ├── stores/            # Pinia store (portfolio.js)
│   │   ├── utils/             # compound.js — pure financial math
│   │   ├── views/             # Dashboard, HowItWorks, About
│   │   └── router/            # Vue Router config
│   └── vite.config.js
│
├── backend/                   # Express REST API
│   ├── controllers/           # portfolioController.js
│   ├── routes/                # portfolio.js
│   ├── data/                  # portfolio.json (auto-created on save)
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/networth-simulator.git
cd networth-simulator
```

### 2. Start the Backend
```bash
cd backend
npm install
npm run dev
# API running at http://localhost:3000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🌐 API Endpoints

| Method   | Endpoint        | Description              |
|----------|-----------------|--------------------------|
| GET      | /api/portfolio  | Load saved portfolio     |
| POST     | /api/portfolio  | Save current portfolio   |
| DELETE   | /api/portfolio  | Reset to defaults        |
| GET      | /api/health     | Health check             |

### POST /api/portfolio — Request body
```json
{
  "assets": {
    "bank": 14000,
    "epf": 14000,
    "stocks": 10000,
    "japan": 39712,
    "asb": 0,
    "btc": 750,
    "sol": 500
  },
  "settings": {
    "scenario": "base",
    "years": 10,
    "monthlyEtf": 1500,
    "monthlyBtc": 500,
    "deployJapan": true,
    "includeCrypto": true
  }
}
```

---

## 📊 Asset Return Assumptions

| Asset         | Bull 🚀 | Base 📈 | Bear 🐻 |
|---------------|---------|---------|---------|
| ETF (VOO/MGK) | +14%    | +10%    | -5%     |
| EPF           | +6.5%   | +6.0%   | +5.5%   |
| ASB           | +5.75%  | +5.75%  | +5.0%   |
| Cash/FD       | +2.5%   | +2.5%   | +2.5%   |
| Bitcoin       | +80%    | +35%    | -40%    |
| Solana        | +90%    | +40%    | -50%    |
| SOL Staking   | +3.4%   | +3.4%   | +3.4%   |

---

## 🚢 Deploy to GitHub Pages

```bash
cd frontend
npm run build
npm run deploy      # uses gh-pages package
```

Add to `frontend/package.json` scripts:
```json
"deploy": "gh-pages -d dist"
```

Install: `npm install --save-dev gh-pages`

---

## ⚠️ Disclaimer

This is a personal project for educational and portfolio purposes.
All projections are estimates based on historical averages.
**Not financial advice.**

---

## 📄 License

MIT
