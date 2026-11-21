const express = require("express");
const cors = require("cors");
const { fal } = require("@fal-ai/client");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const PORT = process.env.PORT || 3000;

if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "SENSI AI backend" });
});

app.post("/api/video", async (req, res) => {
  try {
    if (!process.env.FAL_KEY) {
      return res.status(500).json({ error: "FAL_KEY is not configured on the server." });
    }

    const { image_url, prompt, duration } = req.body || {};
    if (!image_url || !prompt) {
      return res.status(400).json({ error: "image_url and prompt are required." });
    }

    const seconds = Math.min(10, Math.max(3, Number(duration) || 5));
    const result = await fal.subscribe("fal-ai/kling-video/v2.1/standard/image-to-video", {
      input: {
        image_url,
        prompt,
        duration: String(seconds)
      },
      logs: true
    });

    res.json({ result });
  } catch (error) {
    console.error("Video generation failed:", error);
    res.status(500).json({ error: "Video generation failed. Check server logs." });
  }
});

app.listen(PORT, () => {
  console.log(`SENSI AI backend listening on port ${PORT}`);
});
