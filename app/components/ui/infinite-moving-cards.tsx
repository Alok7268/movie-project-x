"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  onItemClick,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    image?: string | null;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  onItemClick?: (item: { quote: string; name: string; title: string; image?: string | null }) => void;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      addAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, [items, direction, speed]);

  const [start, setStart] = useState(false);
  const [animationDuration, setAnimationDuration] = useState("40s");
  const [animationDirection, setAnimationDirection] = useState("forwards");

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clear any existing duplicated items
      const existingItems = Array.from(scrollerRef.current.children);
      const originalCount = items.length;
      if (existingItems.length > originalCount) {
        // Remove duplicates if they exist
        for (let i = originalCount; i < existingItems.length; i++) {
          scrollerRef.current.removeChild(existingItems[i]);
        }
      }

      // Clone all items for seamless loop
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLLIElement;
        // Re-attach click handler to cloned elements
        if (duplicatedItem && onItemClick) {
          const originalItem = item as HTMLLIElement;
          const itemIdx = originalItem.getAttribute('data-item-idx');
          if (itemIdx !== null) {
            const idx = parseInt(itemIdx, 10);
            if (!isNaN(idx) && idx >= 0 && idx < items.length) {
              const itemData = items[idx];
              duplicatedItem.addEventListener('click', (e) => {
                e.stopPropagation();
                onItemClick(itemData);
              });
            }
          }
        }
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Set animation properties
      if (direction === "left") {
        setAnimationDirection("forwards");
      } else {
        setAnimationDirection("reverse");
      }

      if (speed === "fast") {
        setAnimationDuration("20s");
      } else if (speed === "normal") {
        setAnimationDuration("40s");
      } else {
        setAnimationDuration("80s");
      }

      setStart(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          animationDuration: animationDuration,
          animationDirection: animationDirection,
        }}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[160px] h-[160px] min-w-[160px] max-w-[160px] min-h-[160px] max-h-[160px] shrink-0 flex-shrink-0 flex-grow-0 rounded-2xl border border-[#003566]/50 cursor-pointer hover:scale-105 hover:border-[#ffc300]/50 hover:shadow-lg hover:shadow-[#ffc300]/20 transition-all duration-300 flex items-center justify-center overflow-hidden box-border bg-gradient-to-br from-[#001d3d]/30 to-[#000814]/30 backdrop-blur-sm z-30"
            key={`${item.name}-${idx}`}
            data-item-idx={idx}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.(item);
            }}
            style={{ flexBasis: '160px' }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-2xl pointer-events-none"
              style={{ backgroundImage: `url(${item.image || '/no-poster.svg'})` }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#000814]/80 via-[#001d3d]/70 to-[#000814]/80 rounded-2xl pointer-events-none"></div>
            </div>
            
            {/* Genre Name */}
            <div className="text-center w-full px-3 overflow-hidden relative z-10 pointer-events-none">
              <span className="relative z-20 text-sm md:text-base font-bold text-white group-hover:text-[#ffc300] transition-colors duration-300 drop-shadow-lg break-words hyphens-auto" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                textShadow: '2px 2px 4px rgba(0,0,0,0.9)'
              }}>
                {item.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

