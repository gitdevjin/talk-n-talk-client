"use client";

import { useUser } from "@/hooks/use-user";
import { useState, useRef } from "react";
import UserBar from "../Sidebar/Userbar";

interface TwoPaneLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxRightPadding?: number;
  maxLeftWidth?: number;
}

export default function TwoPaneLayout({
  left,
  right,
  initialLeftWidth = 300,
  minLeftWidth = 150,
  maxLeftWidth = 400,
}: TwoPaneLayoutProps) {
  const { user } = useUser();
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const startDrag = () => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    setLeftWidth(Math.max(minLeftWidth, Math.min(newWidth, maxLeftWidth)));
  };

  const stopDrag = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div ref={containerRef} className="flex flex-1 w-full">
      {/* Left Pane */}
      <div
        className="relative flex flex-col bg-[var(--color-darkgrey-3)] text-white h-full"
        style={{ width: leftWidth }}
      >
        {/* Scrollable top section */}
        <div className="flex-1 overflow-y-auto">{left}</div>

        {/* Floating User Bar (absolute bottom overlay) */}
        <UserBar />
      </div>

      {/* Divider */}
      <div
        className="w-1 cursor-col-resize bg-[var(--color-darkgrey-2)] hover:bg-gray-500"
        onMouseDown={startDrag}
      />

      {/* Right Pane */}
      <div className="flex flex-1 overflow-y-auto w-full bg-[var(--color-darkgrey-2)]">{right}</div>
    </div>
  );
}
