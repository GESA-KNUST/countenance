import React from "react";

interface HeadlineProps {
  text: string;
  highlight: string;
  highlightClass?: string;
  as?: React.ElementType;
  className?: string;
}

export default function Headline({
  text,
  highlight,
  highlightClass = "text-primary",
  as: Tag = "h1",
  className = "",
}: HeadlineProps) {
  const [before, after] = text.split(highlight);

  return (
    <Tag
      className={`font-bold text-4xl leading-12 
        sm:text-[60px] sm:leading-16 
        md:text-[72px] md:leading-[76px] 
        xl:text-[90px] xl:leading-[90px] ${className}`}
    >
      {before}
      <span className={highlightClass}>{highlight}</span>
      {after}
    </Tag>
  );
}
