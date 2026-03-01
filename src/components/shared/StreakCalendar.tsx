import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StreakCalendarProps {
  data: { date: string; count: number }[];
  weeks?: number;
}

const getColorLevel = (count: number): string => {
  if (count === 0) return "bg-secondary";
  if (count <= 2) return "bg-primary/20";
  if (count <= 4) return "bg-primary/40";
  if (count <= 7) return "bg-primary/60";
  return "bg-primary";
};

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function StreakCalendar({ data, weeks = 52 }: StreakCalendarProps) {
  // Build grid: 7 rows × N columns
  const totalDays = weeks * 7;
  const relevantData = data.slice(-totalDays);

  // Pad if needed
  while (relevantData.length < totalDays) {
    relevantData.unshift({ date: "", count: 0 });
  }

  // Chunk into weeks
  const weekColumns: typeof relevantData[] = [];
  for (let i = 0; i < relevantData.length; i += 7) {
    weekColumns.push(relevantData.slice(i, i + 7));
  }

  // Month labels
  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = "";
  weekColumns.forEach((week, i) => {
    const firstDay = week.find((d) => d.date);
    if (firstDay?.date) {
      const month = new Date(firstDay.date).toLocaleString("default", { month: "short" });
      if (month !== lastMonth) {
        monthLabels.push({ label: month, index: i });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="overflow-x-auto scrollbar-thin">
      {/* Month labels */}
      <div className="flex ml-8 mb-1">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="text-xs text-muted-foreground"
            style={{ position: "relative", left: `${m.index * 14}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {dayLabels.map((label, i) => (
            <span key={i} className="text-[10px] text-muted-foreground h-[12px] flex items-center w-6">
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        {weekColumns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => (
              <Tooltip key={`${wi}-${di}`}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: wi * 0.005, duration: 0.15 }}
                    className={`w-[12px] h-[12px] rounded-[2px] ${getColorLevel(day.count)} transition-colors cursor-pointer hover:ring-1 hover:ring-primary/50`}
                  />
                </TooltipTrigger>
                {day.date && (
                  <TooltipContent className="glass-strong border-border text-xs">
                    <p className="font-medium text-foreground">{day.date}</p>
                    <p className="text-muted-foreground">{day.count} activities</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 ml-8">
        <span className="text-xs text-muted-foreground mr-1">Less</span>
        {[0, 2, 4, 7, 10].map((level) => (
          <div key={level} className={`w-[12px] h-[12px] rounded-[2px] ${getColorLevel(level)}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
}
