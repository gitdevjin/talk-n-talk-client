"use client";

import { useState, useRef } from "react";

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
  maxRightPadding = 100,
  maxLeftWidth = 600,
}: TwoPaneLayoutProps) {
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
      <div className="bg-gray-100 overflow-auto" style={{ width: leftWidth }}>
        {left}
      </div>

      {/* Divider */}
      <div
        className="w-1 cursor-col-resize bg-gray-100 hover:bg-gray-500"
        onMouseDown={startDrag}
      />

      {/* Right Pane */}
      <div className="flex flex-1 overflow-y-auto w-full bg-gray-100 ">{right}</div>
    </div>
  );
}
