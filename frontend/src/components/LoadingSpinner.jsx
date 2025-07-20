import React from "react";

export default function LoadingSpinner({ size = "lg", message = "Loading..." }) {
  const sizeClass = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-4",
    lg: "w-8 h-8 border-4",
    xl: "w-12 h-12 border-4",
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className={`animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 ${sizeClass}`}
      ></div>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
