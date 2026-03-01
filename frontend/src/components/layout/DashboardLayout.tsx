import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AIChatBot from "./AIChatBot";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* ml-[72px] = collapsed sidebar width; sidebar expands over content but only on the left */}
      <div className="ml-[72px] transition-all duration-200">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
      <AIChatBot />
    </div>
  );
}
