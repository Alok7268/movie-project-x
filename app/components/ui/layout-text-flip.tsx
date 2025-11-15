"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordsRef = useRef(words);
  const durationRef = useRef(duration ?? 3000);

  // Update refs when props change
  wordsRef.current = words;
  durationRef.current = duration ?? 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsRef.current.length);
    }, durationRef.current);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent drop-shadow-lg md:text-4xl lg:text-6xl"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-xl border border-[#ffc300]/40 bg-[#ffc300]/40 px-4 py-1 font-sans text-2xl font-bold tracking-tight text-white shadow-sm ring shadow-[#ffc300]/20 ring-[#ffc300]/20 drop-shadow-lg md:text-4xl lg:text-6xl backdrop-blur-sm underline decoration-[#ffd60a] decoration-[6px] underline-offset-[16px]"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className={cn("inline-block whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};

