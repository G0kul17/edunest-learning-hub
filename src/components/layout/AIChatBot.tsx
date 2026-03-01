import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const quickPrompts = [
  "Explain this lesson",
  "Help me debug",
  "What should I study next?",
  "Summarize the course",
];

const aiResponses: Record<string, string> = {
  "Explain this lesson": "This lesson covers the fundamentals of the topic. The key concepts include understanding the core principles, applying them to real-world scenarios, and building upon previous knowledge. Would you like me to elaborate on any specific part?",
  "Help me debug": "I'd be happy to help debug! Please share your code snippet and describe the error you're encountering. Common issues include:\n\n1. Syntax errors\n2. Logic errors in conditions\n3. Scope issues with variables\n4. Async/await misuse\n\nPaste your code and I'll take a look! 🔍",
  "What should I study next?": "Based on your progress, I recommend:\n\n🎯 **Immediate:** Complete the remaining lessons in your current course\n📚 **This Week:** Practice 3 coding problems on Arrays & HashMap\n🚀 **Next:** Start the Data Structures & Algorithms course\n\nYou're doing great — keep that streak going! 🔥",
  "Summarize the course": "Here's a quick summary of your current course:\n\n📖 **Topics Covered:** Variables, Control Flow, Functions, Data Structures\n✅ **Completed:** 8/12 lessons (67%)\n📊 **Your Score:** 87% average\n⏭️ **Up Next:** Error Handling, Modules, OOP\n\nYou're on track to complete it within 2 weeks! 💪",
};

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hey! 👋 I'm your EduNest AI assistant. Ask me anything about your courses, coding problems, or study recommendations!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || "That's a great question! Let me think about it... 🤔\n\nBased on my analysis, I'd recommend reviewing the relevant course material and practicing with similar problems. Would you like me to suggest specific resources?";
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: "ai", timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
          </>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[340px] h-[480px] glass-strong rounded-2xl shadow-2xl border border-border flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-primary/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground">EduNest AI 🤖</h3>
                <p className="text-xs text-success">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "glass border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass border border-border px-4 py-2 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 py-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors border border-border"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
