import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Allow CORS for all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // respond to preflight
  }
  next();
});

// Proxy endpoint
app.post("/submit", async (req, res) => {
  try {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxBn2hMpRxDETPmXQSZubWmFUPgndwOEGX7hH7jfoHhPhDcLX4vF6ZaUfesC9u0KGwF/exec"; // your GAS URL

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();  // 👈 get raw text
    let data;

    try {
      data = JSON.parse(text);  // try to parse JSON
    } catch {
      data = { status: "ok", raw: text }; // fallback if not JSON
    }

    res.json(data); // ✅ always send JSON back to Flutter
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
