"use client";

import { useEffect, useState } from "react";

interface ModeToggleProps {
  mode: "simple" | "professional";
  onModeChange: (mode: "simple" | "professional") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-2 border-2 border-purple-500/30 shadow-lg inline-flex gap-2">
        <button
          onClick={() => onModeChange("simple")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === "simple"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span>Simple Mode</span>
          </span>
        </button>

        <button
          onClick={() => onModeChange("professional")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === "professional"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <span>Professional Mode</span>
          </span>
        </button>
      </div>
    </div>
  );
}
