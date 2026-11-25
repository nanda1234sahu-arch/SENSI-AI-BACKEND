
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
  res.json({
    ok: true,
    service: "SENSI AI backend"
  });
});

app.post("/api/video", async (req, res) => {
  try {
    if (!process.env.FAL_KEY) {
      return res.status(500).json({
        error: "FAL_KEY is not configured."
      });
    }

    const { image_url, prompt, duration } = req.body || {};

    if (!image_url || !prompt) {
      return res.status(400).json({
        error: "image_url and prompt are required."
      });
    }

    const seconds = Math.min(
      15,
      Math.max(3, Number(duration) || 5)
    );

    const result = await fal.subscribe(
      "fal-ai/kling-video/v3/standard/image-to-video",
      {
        input: {
          start_image_url: image_url,
          prompt: prompt,
          duration: String(seconds),
          generate_audio: false
        },
        logs: true
      }
    );

    res.json({
      ok: true,
      video: result.data.video,
      requestId: result.requestId
    });

  } catch (error) {
    console.error("Video generation failed:", error);

    res.status(500).json({
      error: "Video generation failed. Check server logs."
    });
  }
});

app.listen(PORT, () => {
  console.log(`SENSI AI backend listening on port ${PORT}`);
});
