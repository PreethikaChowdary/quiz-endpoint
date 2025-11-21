# Quiz Endpoint (Playwright + Render)


This repository implements the timed quiz endpoint required by the evaluation. It validates a secret, visits JS-rendered quiz pages using Playwright, solves / extracts data heuristically, and submits answers to the provided submit endpoint.


## Quick start (local)
1. Copy `.env.example` to `.env` and set your `QUIZ_SECRET`.
2. Install dependencies: `npm ci` (this will run `playwright install` via postinstall).
3. Run locally: `node server.js`
4. Test with curl:


```bash
curl -X POST http://localhost:3000/quiz-endpoint \
-H "Content-Type: application/json" \
-d '{"email":"24f2002054@ds.study.iitm.ac","secret":"1771771","url":"https://tds-llm-analysis.s-anand.net/demo"}'
