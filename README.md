# Language Translator

A React and Express app for translating text between more than 100 languages. Choose source and target languages, listen to text with browser speech synthesis, and copy either side.

![Language Translator preview](https://github.com/a2rp/language-translator/assets/5670738/90e65765-53c6-4d40-9ceb-275e96c0a5ea)

## Run locally

Requirements: Node.js 18 or newer and a RapidAPI key with access to the configured translation API.

1. Start the backend:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

   Set `X_RAPIDAPI_KEY` in `backend/.env`, then run:

   ```powershell
   npm run start:dev
   ```

2. In another terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   Copy-Item .env.example .env.local
   npm start
   ```

   The app opens at [http://localhost:3000](http://localhost:3000). Set `REACT_APP_TRANSLATION_API_URL` in `frontend/.env.local` if the backend uses a different URL. Restart the React dev server after changing frontend environment values.

The backend listens on port `1198` by default and allows the frontend origin `http://localhost:3000`. Configure `PORT` and `CORS_ORIGIN` in `backend/.env` for another local or hosted setup. For multiple origins, use a comma-separated `CORS_ORIGIN` value.

## API

`POST /api/v1/translate`

```json
{
  "from": "en",
  "to": "hi",
  "text": "Hello, how are you?"
}
```

The request must include language codes and non-empty text. Text is limited to 6,000 UTF-8 bytes and the encoded provider request is capped below the provider's documented 8,192-byte request limit. Requests are limited to 20 per IP per minute by an in-memory limiter.

## Data and deployment

The backend sends the text and language codes to the configured RapidAPI translation provider. Avoid submitting confidential or sensitive text. The RapidAPI key stays on the backend and must never be added to frontend environment variables. The API is a demo service: CORS only controls browser access, and the in-memory rate limit is per process. A public deployment should add user authentication and a shared rate-limit store, configure trusted proxy behavior for its host, and review the provider's current terms and privacy policy.

## Project structure

- `frontend/`: React interface and browser speech/copy controls.
- `backend/`: Express API that validates input and calls the translation provider.
## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [a2rp](https://github.com/a2rp)
- CodePen: [ash1198](https://codepen.io/ash1198)
- LinkedIn: [Ashish Ranjan](https://www.linkedin.com/in/aashishranjan)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- [Support page](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://patreon.com/a2rp)