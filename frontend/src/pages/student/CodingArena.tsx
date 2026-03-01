import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockProblems } from "@/data/mockData";
import { Search, CheckCircle, Circle, Play, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CodingArena() {
  const { problemId } = useParams();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(
    problemId ? mockProblems.find((p) => p.id === problemId) : null
  );
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState<"accepted" | "wrong" | null>(null);

  const filtered = mockProblems.filter((p) => {
    if (difficulty !== "All" && p.difficulty !== difficulty) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const runCode = () => {
    setOutput("Running test cases...\n\nTest Case 1: ✅ Passed\nTest Case 2: ✅ Passed\nTest Case 3: ✅ Passed\n\nAll test cases passed!");
    setVerdict("accepted");
  };

  if (selectedProblem) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left — problem statement */}
        <div className="w-1/2 border-r border-border overflow-y-auto h-screen p-6 scrollbar-thin">
          <button
            onClick={() => { setSelectedProblem(null); setVerdict(null); setOutput(""); }}
            className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
          >
            ← Back to problems
          </button>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="font-heading text-xl font-bold text-foreground">{selectedProblem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              selectedProblem.difficulty === "Easy" ? "bg-success/20 text-success" :
              selectedProblem.difficulty === "Medium" ? "bg-warning/20 text-warning" :
              "bg-destructive/20 text-destructive"
            }`}>
              {selectedProblem.difficulty}
            </span>
          </div>

          <div className="flex gap-1.5 mb-4">
            {selectedProblem.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-sm text-foreground whitespace-pre-line">{selectedProblem.description}</p>

            <div className="mt-4 space-y-3">
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Example {i + 1}:</p>
                  <pre className="text-xs font-mono text-foreground">Input: {ex.input}</pre>
                  <pre className="text-xs font-mono text-foreground">Output: {ex.output}</pre>
                  {ex.explanation && <p className="text-xs text-muted-foreground mt-1">{ex.explanation}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Constraints:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i} className="font-mono">{c}</li>
                ))}
              </ul>
            </div>

            {selectedProblem.hints.length > 0 && (
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">💡 Show Hints</summary>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {selectedProblem.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </details>
            )}
          </div>
        </div>

        {/* Right — code editor */}
        <div className="w-1/2 flex flex-col h-screen">
          {/* Language selector */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex gap-2">
              {Object.keys(selectedProblem.starterCode).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setCode(selectedProblem.starterCode[lang] || "");
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${
                    language === lang ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code editor (textarea fallback — Monaco would replace this) */}
          <div className="flex-1 p-0">
            <textarea
              value={code || selectedProblem.starterCode[language] || ""}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-background p-4 font-mono text-sm text-foreground resize-none focus:outline-none border-none"
              spellCheck={false}
            />
          </div>

          {/* Output panel */}
          <div className="h-48 border-t border-border overflow-y-auto">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <button className="text-xs text-muted-foreground font-medium">Output</button>
            </div>

            {verdict && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mx-3 mt-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  verdict === "accepted" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                }`}
              >
                {verdict === "accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
              </motion.div>
            )}

            <pre className="p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap">{output}</pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-3 border-t border-border">
            <button
              onClick={runCode}
              className="flex-1 py-2 rounded-lg bg-success/20 text-success text-sm font-medium hover:bg-success/30 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Run
            </button>
            <button
              onClick={runCode}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Problem list
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Coding Arena</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === d ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <GlowCard glowColor="blue" className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium w-12">Status</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Title</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Difficulty</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Acceptance</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((problem, i) => (
                <motion.tr
                  key={problem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setSelectedProblem(problem); setCode(problem.starterCode[language] || ""); setVerdict(null); setOutput(""); }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    {problem.solved ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : problem.attempted ? (
                      <Circle className="w-4 h-4 text-warning" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground">{problem.title}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      problem.difficulty === "Easy" ? "bg-success/20 text-success" :
                      problem.difficulty === "Medium" ? "bg-warning/20 text-warning" :
                      "bg-destructive/20 text-destructive"
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-mono">{problem.acceptance}%</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {problem.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      </div>
    </DashboardLayout>
  );
}
