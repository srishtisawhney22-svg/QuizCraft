import { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "C", "Python"],
    answer: "CSS",
    category: "CSS",
    difficulty: "Easy",
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Home Text Markup Language",
    ],
    answer: "Hyper Text Markup Language",
    category: "HTML",
    difficulty: "Easy",
  },
  {
    question: "Which company developed Java?",
    options: ["Microsoft", "Google", "Sun Microsystems", "Apple"],
    answer: "Sun Microsystems",
    category: "Programming Basics",
    difficulty: "Medium",
  },
  {
    question: "Which symbol is used for comments in JavaScript (single line)?",
    options: ["##", "//", "<!--", "**"],
    answer: "//",
    category: "JavaScript",
    difficulty: "Easy",
  },
  {
    question: "Which data type stores True or False values?",
    options: ["String", "Integer", "Boolean", "Float"],
    answer: "Boolean",
    category: "Programming Basics",
    difficulty: "Easy",
  },
  {
    question: "Which HTML tag creates a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<p>"],
    answer: "<a>",
    category: "HTML",
    difficulty: "Medium",
  },
  {
    question: "Which method adds an item to the end of a JavaScript array?",
    options: ["pop()", "shift()", "push()", "join()"],
    answer: "push()",
    category: "JavaScript",
    difficulty: "Medium",
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    options: ["var", "let", "const", "fixed"],
    answer: "const",
    category: "JavaScript",
    difficulty: "Easy",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative System Software",
      "Colorful Style System",
    ],
    answer: "Cascading Style Sheets",
    category: "CSS",
    difficulty: "Medium",
  },
  {
    question: "Which function displays a message in the browser console?",
    options: ["print()", "console.log()", "show()", "display()"],
    answer: "console.log()",
    category: "JavaScript",
    difficulty: "Easy",
  },
];

const categories = [
  "All Topics",
  "HTML",
  "CSS",
  "JavaScript",
  "Programming Basics",
];

const difficulties = ["All Levels", "Easy", "Medium"];

function Option({ option, selected, onClick }) {
  return (
    <button
      type="button"
      className={`option ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {option}
    </button>
  );
}

function Question({ question, selected, onSelect }) {
  return (
    <div>
      <h2 className="question-text">{question.question}</h2>

      <div className="options">
        {question.options.map((option, index) => (
          <Option
            key={option}
            option={
              <span className="option-content">
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </span>
            }
            selected={selected === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </div>
  );
}

function QuizProgress({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-area">
      <div className="progress-info">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% completed</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function Result({ score, total, correct, review, onRestart }) {
  return (
    <div className="result-screen">
      <div className="result-icon">🏆</div>
      <p className="eyebrow">QUIZ COMPLETED</p>
      <h1>Your Results</h1>

      <div className="score-circle">
        <strong>{score}%</strong>
        <span>Your Score</span>
      </div>

      <div className="result-stats">
        <div>
          <strong>{correct}</strong>
          <span>Correct</span>
        </div>
        <div>
          <strong>{total - correct}</strong>
          <span>Incorrect / Skipped</span>
        </div>
      </div>

      <p className="result-message">
        {score >= 80
          ? "Excellent work! You know your basics well."
          : score >= 50
          ? "Good effort! Keep practising to improve."
          : "Keep learning! Every attempt makes you better."}
      </p>

      <div className="review-section">
        <h2>📝 Answer Review</h2>
        <p className="review-intro">
          Check your answers and learn from your mistakes.
        </p>

        {review.map((item, index) => (
          <div
            className={`review-card ${
              item.isCorrect ? "review-correct" : "review-incorrect"
            }`}
            key={`${item.question}-${index}`}
          >
            <div className="review-heading">
              <strong>Q{index + 1}. {item.question}</strong>
              <span>{item.isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
            </div>

            <p>
              Your answer: <strong>{item.selected || "Not answered"}</strong>
            </p>
            <p>
              Correct answer: <strong>{item.answer}</strong>
            </p>
            <small>
              {item.category} · {item.difficulty}
            </small>
          </div>
        ))}
      </div>

      <button className="primary-button" onClick={onRestart}>
        Try Again ↻
      </button>
    </div>
  );
}

function App() {
  const [stage, setStage] = useState("home");
  const [category, setCategory] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [correct, setCorrect] = useState(0);
  const [review, setReview] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const availableQuestions = questions.filter((question) => {
    const matchesCategory =
      category === "All Topics" || question.category === category;
    const matchesDifficulty =
      difficulty === "All Levels" || question.difficulty === difficulty;

    return matchesCategory && matchesDifficulty;
  });

  // Count down while the quiz is active.
  useEffect(() => {
    if (stage !== "quiz") return;

    const timerId = setInterval(() => {
      setTimeLeft((time) => (time > 0 ? time - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [stage, current]);

  // Automatically move on when the timer reaches zero.
  useEffect(() => {
    if (stage === "quiz" && timeLeft === 0) {
      nextQuestion();
    }
  }, [timeLeft, stage]);

  function startQuiz() {
    if (availableQuestions.length === 0) return;

    // Make a shuffled copy so the original questions stay unchanged.
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);

    setQuizQuestions(shuffled);
    setCurrent(0);
    setSelected("");
    setCorrect(0);
    setReview([]);
    setTimeLeft(20);
    setStage("quiz");
  }

  function nextQuestion() {
    if (stage !== "quiz" || !quizQuestions[current]) return;

    const activeQuestion = quizQuestions[current];
    const isCorrect = selected === activeQuestion.answer;

    const reviewItem = {
      question: activeQuestion.question,
      selected: selected,
      answer: activeQuestion.answer,
      isCorrect: isCorrect,
      category: activeQuestion.category,
      difficulty: activeQuestion.difficulty,
    };

    setReview((oldReview) => [...oldReview, reviewItem]);

    if (isCorrect) {
      setCorrect((oldCorrect) => oldCorrect + 1);
    }

    setSelected("");

    if (current + 1 < quizQuestions.length) {
      setCurrent((oldCurrent) => oldCurrent + 1);
      setTimeLeft(20);
    } else {
      setStage("result");
    }
  }

  const activeQuestion = quizQuestions[current];
  const score =
    quizQuestions.length > 0
      ? Math.round((correct / quizQuestions.length) * 100)
      : 0;

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">Q</span>
          <span>
            Quiz<span className="brand-highlight">Craft</span>
          </span>
        </div>
        <span className="topbar-label">🏆 INTERACTIVE QUIZ</span>
      </header>

      {stage === "home" && (
        <section className="card home-screen">
          <div className="sticker sticker-bulb">💡</div>
          <div className="sticker sticker-code">{"</>"}</div>
          <div className="sticker sticker-star">✦</div>

         <div className="hero-icon">&lt;/&gt;</div>
          <p className="eyebrow">TEST YOUR KNOWLEDGE</p>
          <h1>
            Ready to challenge <span>yourself?</span>
          </h1>
          <p className="description">
            Answer questions, track your progress, and discover how much
            you know about web development.
          </p>

          <div className="quiz-details">
            <div>
              <span className="stat-icon purple">?</span>
              <strong>10</strong>
              <span>Questions available</span>
            </div>
            <div>
              <span className="stat-icon green">☷</span>
              <strong>4</strong>
              <span>Options each</span>
            </div>
            <div>
              <span className="stat-icon pink">★</span>
              <strong>20s</strong>
              <span>Per question</span>
            </div>
          </div>

          <div className="quiz-settings">
            <label>
              📚 Choose a category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              🎯 Choose difficulty
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {difficulties.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="question-count">
            {availableQuestions.length} question(s) match your choices
          </p>

          <button
            className="primary-button"
            onClick={startQuiz}
            disabled={availableQuestions.length === 0}
          >
            Start Quiz <span>→</span>
          </button>

          <p className="small-note">
            ✨ Small steps, big skills. Choose your best answer!
          </p>
        </section>
      )}

      {stage === "quiz" && activeQuestion && (
        <section className="card quiz-screen">
          <div className="quiz-topline">
            <span className="category-pill">{activeQuestion.category}</span>
            <span className={`difficulty-pill ${activeQuestion.difficulty.toLowerCase()}`}>
              {activeQuestion.difficulty}
            </span>
            <span className={`timer ${timeLeft <= 5 ? "timer-warning" : ""}`}>
              ⏱️ 00:{String(timeLeft).padStart(2, "0")}
            </span>
          </div>

          <QuizProgress
            current={current + 1}
            total={quizQuestions.length}
          />

          <div className="question-label">
            QUESTION {String(current + 1).padStart(2, "0")}
          </div>

          <Question
            question={activeQuestion}
            selected={selected}
            onSelect={setSelected}
          />

          <div className="quiz-footer">
            <span>{quizQuestions.length - current - 1} questions after this</span>
            <button className="primary-button" onClick={nextQuestion}>
              {current === quizQuestions.length - 1
                ? "See Results"
                : "Next Question"} →
            </button>
          </div>
          <p className="small-note">
            No worries if time runs out — that question will be marked incorrect.
          </p>
        </section>
      )}

      {stage === "result" && (
        <section className="card">
          <Result
            score={score}
            total={quizQuestions.length}
            correct={correct}
            review={review}
            onRestart={() => setStage("home")}
          />
        </section>
      )}

      <footer className="footer">
        Made for curious minds <span>♥</span>
      </footer>
    </main>
  );
}

export default App;