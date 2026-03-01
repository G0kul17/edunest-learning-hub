import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgressRing from "@/components/ui/ProgressRing";
import { mockTests } from "@/data/mockData";
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

type Phase = "instructions" | "test" | "results";

export default function TestPage() {
  const { testId } = useParams();
  const test = mockTests.find((t) => t.id === testId) || mockTests[0];

  const [phase, setPhase] = useState<Phase>("instructions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);

  // Timer
  useEffect(() => {
    if (phase !== "test") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    test.questions.forEach((q) => {
      total += q.points;
      if (answers[q.id] !== undefined && answers[q.id] === q.correctAnswer) {
        correct += q.points;
      }
    });
    return { correct, total, pct: total > 0 ? (correct / total) * 100 : 0 };
  };

  const question = test.questions[currentQ];
  const score = calculateScore();

  if (phase === "instructions") {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">{test.title}</h1>
            <p className="text-muted-foreground mt-2">{test.courseName}</p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-2xl font-bold text-primary font-mono">{test.duration}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-2xl font-bold text-accent font-mono">{test.questionCount}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-2xl font-bold text-warning font-mono">{test.passMark}%</p>
                <p className="text-xs text-muted-foreground">Pass Mark</p>
              </div>
            </div>

            <div className="text-left mt-6 space-y-2">
              <p className="text-sm text-muted-foreground">📌 Instructions:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Answer all questions within the time limit</li>
                <li>You can flag questions to review later</li>
                <li>Test auto-submits when time runs out</li>
                <li>You cannot go back after submission</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase("test")}
              className="mt-8 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Test
            </button>
            <p className="text-xs text-muted-foreground mt-2">⚠️ Timer starts immediately</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === "results") {
    const passed = score.pct >= test.passMark;
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-xl p-8 text-center">
            <ProgressRing progress={score.pct} size={120} strokeWidth={8} color={passed ? "hsl(var(--success))" : "hsl(var(--destructive))"}>
              <span className="text-2xl font-bold text-foreground font-mono">{Math.round(score.pct)}%</span>
            </ProgressRing>
            <h2 className="font-heading text-xl font-bold text-foreground mt-4">
              {passed ? "Congratulations! You Passed! 🎉" : "Better Luck Next Time"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Score: {score.correct}/{score.total} points · {test.questions.filter((q) => answers[q.id] !== undefined).length} answered
            </p>
          </motion.div>

          {/* Per-question review */}
          <div className="space-y-3">
            {test.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{q.text}</p>
                      {q.options && (
                        <div className="mt-2 space-y-1">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${
                              oi === q.correctAnswer ? "bg-success/20 text-success" :
                              oi === userAnswer ? "bg-destructive/20 text-destructive" :
                              "text-muted-foreground"
                            }`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.explanation && <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Test-taking UI
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 glass border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
        <h2 className="font-heading font-semibold text-foreground text-sm">{test.title}</h2>
        <div className="flex items-center gap-4">
          <span className={`flex items-center gap-1 font-mono text-sm ${timeLeft < 60 ? "text-destructive animate-pulse" : timeLeft < 300 ? "text-warning" : "text-foreground"}`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-muted-foreground">Q {currentQ + 1}/{test.questions.length}</span>
          <button
            onClick={() => setPhase("results")}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Main question area */}
        <main className="flex-1 p-6 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Question {currentQ + 1}</span>
                <button
                  onClick={() => {
                    const next = new Set(flagged);
                    next.has(question.id) ? next.delete(question.id) : next.add(question.id);
                    setFlagged(next);
                  }}
                  className={`flex items-center gap-1 text-sm ${flagged.has(question.id) ? "text-warning" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Flag className="w-4 h-4" /> {flagged.has(question.id) ? "Flagged" : "Flag"}
                </button>
              </div>

              <h2 className="text-lg font-medium text-foreground mb-6">{question.text}</h2>

              {question.options && (
                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setAnswers({ ...answers, [question.id]: i })}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        answers[question.id] === i
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      <span className="font-mono text-xs mr-3">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {question.hint && (
                <p className="text-xs text-muted-foreground mt-4 italic">💡 Hint: {question.hint}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentQ(Math.min(test.questions.length - 1, currentQ + 1))}
              disabled={currentQ === test.questions.length - 1}
              className="flex items-center gap-1 text-sm text-primary hover:underline disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* Question grid */}
        <aside className="w-48 glass border-l border-border h-[calc(100vh-56px)] sticky top-14 p-4 hidden md:block">
          <h3 className="text-xs text-muted-foreground font-medium mb-3">Questions</h3>
          <div className="grid grid-cols-5 gap-1.5">
            {test.questions.map((q, i) => {
              const answered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              const isActive = i === currentQ;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center transition-all relative ${
                    isActive ? "ring-2 ring-primary" : ""
                  } ${
                    answered ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                  {isFlagged && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-warning rounded-full" />}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
