
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner'; // Assuming LoadingSpinner is simple or not needed if parent handles text

interface AnalysisDisplayProps {
  result: string | null;
  isLoading: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg shadow">
        <LoadingSpinner />
        <p className="mt-4 text-neutral-600 font-medium">Analyzing your plant...</p>
        <p className="text-sm text-neutral-500">This may take a few moments.</p>
      </div>
    );
  }

  if (!result) {
    return null; // Don't render anything if there's no result and not loading
  }

  // Basic markdown-like text processing for improved readability
  const processedLines = result
    .split('\n')
    .map((line, index) => {
      line = line.trim();
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-neutral-700 mt-3 mb-1">{line.substring(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-neutral-700 mt-4 mb-2">{line.substring(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-neutral-800 mt-5 mb-3">{line.substring(2)}</h1>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        // Ensure list items don't have leading/trailing spaces that affect styling
        return <li key={index} className="text-neutral-600">{line.substring(2).trim()}</li>;
      }
      if (line === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-neutral-700 leading-relaxed my-1">{line}</p>;
    });

  const formattedResult = processedLines.reduce<React.ReactNode[]>((acc, currNode, idx) => {
    // Check if current node is an LI element
    if (React.isValidElement(currNode) && currNode.type === 'li') {
      const lastElementInAcc = acc.length > 0 ? acc[acc.length - 1] : null;

      // Check if the last element in accumulator is a UL element
      if (lastElementInAcc && React.isValidElement(lastElementInAcc) && lastElementInAcc.type === 'ul') {
        // It is, so append the current LI to this UL's children
        const ulElement = lastElementInAcc as React.ReactElement<React.HTMLAttributes<HTMLUListElement>>;
        
        // Ensure props.children is treated as an array, even if it's a single child initially
        const existingChildren = React.Children.toArray(ulElement.props.children);
        const newChildren = [...existingChildren, currNode];
        
        // Clone the UL element with the new children array
        acc[acc.length - 1] = React.cloneElement(ulElement, { ...ulElement.props, children: newChildren });
      } else {
        // It's not, or acc is empty, or last element is not a UL. Start a new UL.
        acc.push(<ul key={`ul-${idx}`} className="list-disc pl-5 my-2 ml-5">{[currNode]}</ul>); // Added ml-5 to ul for consistent indentation with li
      }
    } else {
      // Current node is not an LI (e.g., p, h1, br), just push it to the accumulator
      acc.push(currNode);
    }
    return acc;
  }, []);


  return (
    <div className="mt-6 p-6 bg-green-50 border border-leaf-DEFAULT/30 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-leaf-dark mb-4">Analysis Report</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {formattedResult}
      </div>
    </div>
  );
};
