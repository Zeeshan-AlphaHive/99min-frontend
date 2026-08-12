"use client";

import React from "react";
import HorizontalScrollArea from "@/components/shared/HorizontalScrollArea";

interface ExploreHorizontalSectionProps {
  title: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

const ExploreHorizontalSection: React.FC<ExploreHorizontalSectionProps> = ({
  title,
  children,
  isEmpty,
  emptyMessage,
}) => {
  if (isEmpty) {
    return emptyMessage ? (
      <section>
        <h2 className="text-base font-bold text-textBlack mb-3">{title}</h2>
        <p className="text-sm text-textGray">{emptyMessage}</p>
      </section>
    ) : null;
  }

  return (
    <section>
      <h2 className="text-base font-bold text-textBlack mb-3">{title}</h2>
      <HorizontalScrollArea className="-mx-4 px-4">
        {children}
      </HorizontalScrollArea>
    </section>
  );
};

export default ExploreHorizontalSection;
