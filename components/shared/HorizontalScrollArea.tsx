"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  gapClassName?: string;
  showArrows?: boolean;
}

const HorizontalScrollArea: React.FC<HorizontalScrollAreaProps> = ({
  children,
  className = "",
  gapClassName = "gap-3",
  showArrows = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, children]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative group ${className}`}>
      {showArrows && canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-textBlack hover:bg-orange hover:text-white hover:border-orange transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-stylish pb-1 scroll-smooth"
      >
        <div className={`flex min-w-max ${gapClassName}`}>{children}</div>
      </div>

      {showArrows && canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-textBlack hover:bg-orange hover:text-white hover:border-orange transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default HorizontalScrollArea;
