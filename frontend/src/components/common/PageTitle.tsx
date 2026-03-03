import React from "react";

export default function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative left-2 mt-20 flex h-24 w-full items-center justify-start p-10 text-center text-2xl font-bold md:mt-30 md:text-6xl ${className}`}
    >
      <h1>{children}</h1>
    </div>
  );
}
