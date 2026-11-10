# Language Translator frontend

The React app offers source/target language selection, text translation, browser speech playback, and copy controls.

## Setup

Requires Node.js 18 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm start
```

The frontend expects the backend at `http://localhost:1198/api/v1` by default. Set `REACT_APP_TRANSLATION_API_URL` in `.env.local` to change it, then restart the dev server.

See the repository [README](../README.md) for backend setup, RapidAPI configuration, and the data handling note.