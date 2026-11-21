# SENSI AI fal.ai Backend Starter

This is a starter Node.js backend for the SENSI AI Android app.

## Important
- This is source code, not an installable Android APK.
- Set `FAL_KEY` as a secret environment variable on your hosting provider.
- Never put your fal.ai API key in the Android app, GitHub, or chat.
- AI video generation may use paid credits. Check fal.ai pricing before making requests.
- This starter returns the provider result directly; it does not yet include permanent video storage, user accounts, rate limits, or long-episode stitching.

## Run locally
1. Install Node.js.
2. Run `npm install`.
3. Set the `FAL_KEY` environment variable.
4. Run `npm start`.

## Endpoints
- `GET /health`
- `POST /api/video` with JSON:
  `{ "image_url": "https://...", "prompt": "A character runs forward", "duration": 5 }`

The image URL must be publicly accessible by the provider.
