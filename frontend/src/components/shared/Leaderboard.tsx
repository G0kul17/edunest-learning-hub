import React from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Flame } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  score: number;
  streak: number;
  completionPct: number;
  courseName: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  currentUserId?: string;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-warning" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-warning/60" />;
  return <span className="text-sm text-muted-foreground font-mono w-5 text-center">{rank}</span>;
}

export default function Leaderboard({ data, currentUserId }: LeaderboardProps) {
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div>
      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-6">
        {[1, 0, 2].map((index) => {
          const entry = top3[index];
          if (!entry) return null;
          const rank = index + 1;
          const heights = [120, 140, 100];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 border-2 border-primary/30">
                <span className="text-sm font-bold text-primary">{getInitials(entry.name)}</span>
              </div>
              <p className="text-xs font-medium text-foreground mb-1 text-center truncate max-w-[80px]">{entry.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{entry.score.toFixed(1)}%</p>
              <div
                className={`w-16 rounded-t-lg flex items-start justify-center pt-2 ${
                  rank === 1 ? "bg-primary/20" : rank === 2 ? "bg-muted" : "bg-muted/60"
                }`}
                style={{ height: heights[index] }}
              >
                {getRankIcon(rank === 1 ? 1 : rank === 0 ? 2 : 3)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of list */}
      <div className="space-y-1">
        {rest.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              entry.id === currentUserId ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/50"
            }`}
          >
            {getRankIcon(i + 4)}
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-foreground">{getInitials(entry.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground truncate">{entry.courseName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-24">
                <div className="h-1.5 bg-secondary rounded-full">
                  <div className="h-1.5 bg-primary rounded-full" style={{ width: `${entry.completionPct}%` }} />
                </div>
              </div>
              <span className={`text-sm font-mono font-medium ${entry.score >= 80 ? "text-success" : entry.score >= 60 ? "text-warning" : "text-destructive"}`}>
                {entry.score.toFixed(1)}%
              </span>
              {entry.streak > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-warning">
                  <Flame className="w-3 h-3" />
                  {entry.streak}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
