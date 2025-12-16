import React from 'react'

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size: "lg" | "xl";
}

const Container = ({ children, className, size }: ContainerProps) => {
  return (
    <div className={`xl:px-16 sm:px-10 px-6 py-10 ${className}`}>
      <div className={`${size === "lg" ? "max-w-5xl" : "max-w-6xl"} mx-auto`}>
        {children}
      </div>
    </div>
  )
}

export default Container;