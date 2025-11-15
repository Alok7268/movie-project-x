"use client";

import React from "react";
import { SparklesCore } from "@/app/components/ui/sparkles";

export default function SparklesBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden bg-black">
      <div className="w-full h-full absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
    </div>
  );
}

