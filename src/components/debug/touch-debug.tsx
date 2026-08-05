"use client";

import { useEffect, useState } from "react";

export function TouchDebug() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    function handleTouch(e: TouchEvent) {
      const t = e.touches[0] || e.changedTouches[0];
      if (!t) return;
      const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
      console.log("Touch at", t.clientX, t.clientY, "->", el);
      if (!el) return;
      const prevOutline = el.style.outline;
      const prevPointer = el.style.pointerEvents;
      el.style.outline = "3px solid rgba(255,0,0,0.9)";
      el.style.pointerEvents = "auto";
      const info = document.createElement("div");
      info.textContent = `${el.tagName.toLowerCase()} ${el.className ? '.' + el.className.split(' ').join('.') : ''}`;
      info.style.position = "fixed";
      info.style.left = Math.min(window.innerWidth - 200, t.clientX + 8) + "px";
      info.style.top = Math.min(window.innerHeight - 40, t.clientY + 8) + "px";
      info.style.zIndex = "99999";
      info.style.background = "rgba(0,0,0,0.75)";
      info.style.color = "white";
      info.style.padding = "6px 8px";
      info.style.borderRadius = "6px";
      info.style.fontSize = "12px";
      document.body.appendChild(info);
      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.pointerEvents = prevPointer;
        if (info.parentElement) info.parentElement.removeChild(info);
      }, 1200);
    }

    window.addEventListener("touchstart", handleTouch, { passive: true });
    return () => window.removeEventListener("touchstart", handleTouch);
  }, [active]);

  return (
    <div style={{ position: "fixed", right: 12, bottom: 84, zIndex: 99998 }}>
      <button
        onClick={() => setActive((v) => !v)}
        style={{
          background: active ? "#ef4444" : "#111827",
          color: "white",
          padding: "8px 10px",
          borderRadius: 10,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          border: "none",
        }}
        aria-pressed={active}
      >
        {active ? "Touch Debug: ON" : "Touch Debug"}
      </button>
    </div>
  );
}
