import React from "react";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

/**
 * Simple rich text renderer.
 * Supports:
 *  - Paragraphs (double newline separated blocks)
 *  - Unordered lists (lines starting with "- " or "* ")
 *  - Ordered lists (lines starting with "1. ", "2. ", etc.)
 *  - Bold text wrapped in **double asterisks**
 */
export function RichTextDisplay({
  content,
  className = "",
}: RichTextDisplayProps) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className={`space-y-3 text-sm text-gray-700 leading-relaxed ${className}`}>
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const lines = trimmed.split("\n");

        // Check if all lines are unordered list items
        const isUnorderedList = lines.every((line) =>
          /^[\-\*]\s/.test(line.trim())
        );

        if (isUnorderedList) {
          return (
            <ul key={blockIdx} className="list-disc pl-5 space-y-1">
              {lines.map((line, i) => (
                <li key={i}>{renderInline(line.trim().replace(/^[\-\*]\s/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Check if all lines are ordered list items
        const isOrderedList = lines.every((line) =>
          /^\d+\.\s/.test(line.trim())
        );

        if (isOrderedList) {
          return (
            <ol key={blockIdx} className="list-decimal pl-5 space-y-1">
              {lines.map((line, i) => (
                <li key={i}>
                  {renderInline(line.trim().replace(/^\d+\.\s/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Default: paragraph
        return (
          <p key={blockIdx}>{renderInline(trimmed.replace(/\n/g, " "))}</p>
        );
      })}
    </div>
  );
}

/**
 * Render inline formatting: **bold** text.
 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
