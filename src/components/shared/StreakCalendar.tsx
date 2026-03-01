import React, { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StreakCalendarProps {
  data: { date: string; count: number }[];
  months?: number;
}

const LEVEL_COLORS = [
  "bg-secondary/60",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/65",
  "bg-primary",
];

function getLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const DAY_LABEL_W = 28;
const GAP = 2;
const DAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

export default function StreakCalendar({ data, months = 12 }: StreakCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(13);

  const dataMap = useMemo(() => {
    const m = new Map<string, number>();
    data.forEach(({ date, count }) => { if (date) m.set(date, count); });
    return m;
  }, [data]);

  const { weeks, monthLabelMap } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rangeStart = new Date(today);
    rangeStart.setMonth(rangeStart.getMonth() - months + 1);
    rangeStart.setDate(1);
    // Align to Sunday
    rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay());

    const weeks: { iso: string; count: number; active: boolean }[][] = [];
    const cursor = new Date(rangeStart);

    while (cursor <= today) {
      const week: { iso: string; count: number; active: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const iso = cursor.toISOString().split("T")[0];
        week.push({ iso, count: dataMap.get(iso) ?? 0, active: cursor <= today });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    // Build a map: week-index → month label
    // Show a label only when the month changes AND there's enough space from the last label
    const monthLabelMap = new Map<number, string>();
    let lastMonth = -1;
    let lastLabelCol = -99;

    weeks.forEach((week, col) => {
      const activeDay = week.find((d) => d.active);
      if (!activeDay) return;
      const [y, mo] = activeDay.iso.split("-").map(Number);
      const date = new Date(y, mo - 1, 1);
      const m = date.getMonth();
      // require at least 3 week columns of gap to prevent overlap
      if (m !== lastMonth && col - lastLabelCol >= 3) {
        monthLabelMap.set(col, date.toLocaleString("default", { month: "short" }));
        lastMonth = m;
        lastLabelCol = col;
      }
    });

    return { weeks, monthLabelMap };
  }, [dataMap, months]);

  // Responsive cell size via ResizeObserver
  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const available = containerRef.current.clientWidth - DAY_LABEL_W - 4;
      const cs = Math.floor((available - (weeks.length - 1) * GAP) / weeks.length);
      setCellSize(Math.max(8, Math.min(18, cs)));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [weeks.length]);

  return (
    <div ref={containerRef} className="w-full select-none">

      {/* ── Top row: day-label spacer + month labels (same flex as grid) ── */}
      <div className="flex mb-1">
        {/* Spacer to match day-label column */}
        <div style={{ width: DAY_LABEL_W + 4, flexShrink: 0 }} />

        {/* One cell per week — label overflows right with overflow:visible */}
        <div className="flex flex-1" style={{ gap: GAP }}>
          {weeks.map((_, wi) => (
            <div
              key={wi}
              className="flex-1 relative overflow-visible"
              style={{ height: 14 }}
            >
              {monthLabelMap.has(wi) && (
                <span className="absolute left-0 top-0 text-[10px] text-muted-foreground whitespace-nowrap">
                  {monthLabelMap.get(wi)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid: day labels + week columns ── */}
      <div className="flex">
        {/* Day-of-week labels column */}
        <div
          className="flex flex-col shrink-0"
          style={{ width: DAY_LABEL_W, gap: GAP, marginRight: 4 }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{ height: cellSize }}
              className="text-[9px] text-muted-foreground flex items-center justify-end pr-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex flex-1" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-1" style={{ gap: GAP }}>
              {week.map((day, di) => (
                <Tooltip key={di}>
                  <TooltipTrigger asChild>
                    <div
                      style={{ height: cellSize }}
                      className={`w-full rounded-[2px] cursor-pointer transition-colors hover:ring-1 hover:ring-primary/60 ${
                        day.active ? LEVEL_COLORS[getLevel(day.count)] : "bg-transparent"
                      }`}
                    />
                  </TooltipTrigger>
                  {day.active && (
                    <TooltipContent className="border-border text-xs">
                      <p className="font-medium text-foreground">{day.iso}</p>
                      <p className="text-muted-foreground">
                        {day.count === 0
                          ? "No activity"
                          : `${day.count} activit${day.count === 1 ? "y" : "ies"}`}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-1.5 mt-2"
        style={{ marginLeft: DAY_LABEL_W + 4 }}
      >
        <span className="text-[10px] text-muted-foreground mr-1">Less</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div
            key={i}
            style={{ width: cellSize, height: cellSize }}
            className={`rounded-[2px] shrink-0 ${cls}`}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
}
