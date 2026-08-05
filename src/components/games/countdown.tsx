"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  duration?: number;
  label?: string;
  onDone: () => void;
}

export function Countdown({ duration = 3, label, onDone }: CountdownProps) {
  const [count, setCount] = useState(duration);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (count <= 0) {
      onDoneRef.current();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  if (count <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="assertive">
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-7xl font-black text-primary"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
