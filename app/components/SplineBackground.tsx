'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Spline component with no SSR
// Using the base export instead of /next to avoid async component issues
const Spline = dynamic(
  () => import('@splinetool/react-spline').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => null,
  }
);

export default function SplineBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden">
      <div className="w-full h-full">
        <Spline
          scene="https://prod.spline.design/q4-V2Cn0NJTQEPvM/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
}

