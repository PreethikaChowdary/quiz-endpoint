import express from "express";
import cors from "cors";
import questions from "./questions.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Quiz API is running");
});

app.get("/quiz", (req, res) => {
  const userSecret = req.query.secret;
  const actualSecret = process.env.QUIZ_SECRET;

  if (!userSecret || userSecret !== actualSecret) {
    return res.status(401).json({ error: "Unauthorized: Invalid secret key" });
  }

  return res.json(questions);
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
