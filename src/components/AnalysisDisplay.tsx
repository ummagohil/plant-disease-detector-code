import React from "react";
import ReactMarkdown from "react-markdown";
import { LoadingSpinner } from "./LoadingSpinner"; // Assuming LoadingSpinner is simple or not needed if parent handles text

interface AnalysisDisplayProps {
  result: string | null;
  isLoading: boolean;
}

export const AnalysisDisplay = ({
  result,
  isLoading,
}: AnalysisDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg shadow">
        <LoadingSpinner />
        <p className="mt-4 text-neutral-600 font-medium">
          Analyzing your plant...
        </p>
        <p className="text-sm text-neutral-500">This may take a few moments.</p>
      </div>
    );
  }

  if (!result) {
    return null; // Don't render anything if there's no result and not loading
  }

  return (
    <div className="mt-6 p-6 bg-green-50 border border-leaf-DEFAULT/30 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-leaf-dark mb-4">
        Analysis Report
      </h2>
      <div className="prose max-h-[60vh] overflow-y-auto pr-2">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </div>
  );
};
