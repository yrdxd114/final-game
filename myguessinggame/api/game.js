import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Homepage
app.get("/", (req, res) => {
  res.render("home");
});

// Start game
app.get("/start", (req, res) => {
  const level = req.query.level || "easy";
  let limit = 100;
  if (level === "medium") limit = 1000;
  if (level === "hard") limit = 10000;

  const number = Math.floor(Math.random() * limit) + 1;
  res.render("index", { limit, tries: 0, message: "", number });
});

// Handle guess
app.post("/play", (req, res) => {
  let { guess, limit, tries, number } = req.body;
  guess = parseInt(guess);
  limit = parseInt(limit);
  tries = parseInt(tries) + 1;
  number = parseInt(number);

  let message = "";
  if (guess > number) message = "Lower!";
  else if (guess < number) message = "Higher!";
  else return res.redirect(`/result?tries=${tries}&number=${number}`);

  res.render("index", { limit, tries, message, number });
});

// Show result
app.get("/result", (req, res) => {
  const tries = req.query.tries;
  const number = req.query.number;
  res.render("result", { tries, number });
});

// For Vercel / local
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
