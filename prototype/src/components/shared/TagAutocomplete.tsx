"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface TagAutocompleteProps {
  label: string;
  placeholder?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  category?: "blue" | "emerald" | "violet" | "amber" | "rose";
}

const categoryStyles: Record<string, { chip: string; option: string }> = {
  blue: {
    chip: "bg-blue-50 text-blue-700",
    option: "text-blue-700 bg-blue-50",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-700",
    option: "text-emerald-700 bg-emerald-50",
  },
  violet: {
    chip: "bg-violet-50 text-violet-700",
    option: "text-violet-700 bg-violet-50",
  },
  amber: {
    chip: "bg-amber-50 text-amber-700",
    option: "text-amber-700 bg-amber-50",
  },
  rose: {
    chip: "bg-rose-50 text-rose-700",
    option: "text-rose-700 bg-rose-50",
  },
};

export function TagAutocomplete({
  label,
  placeholder = "พิมพ์เพื่อค้นหา…",
  options,
  selected,
  onChange,
  category = "blue",
}: TagAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const styles = categoryStyles[category] ?? categoryStyles.blue;

  const filtered = options.filter(
    (opt) =>
      !selected.includes(opt) &&
      opt.toLowerCase().includes(query.toLowerCase())
  );

  const addTag = useCallback(
    (tag: string) => {
      if (!selected.includes(tag)) {
        onChange([...selected, tag]);
      }
      setQuery("");
      setHighlightIndex(-1);
      inputRef.current?.focus();
    },
    [selected, onChange]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(selected.filter((t) => t !== tag));
      inputRef.current?.focus();
    },
    [selected, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && query === "" && selected.length > 0) {
        removeTag(selected[selected.length - 1]);
        return;
      }

      if (!isOpen || filtered.length === 0) {
        if (e.key === "ArrowDown" && filtered.length > 0) {
          setIsOpen(true);
          setHighlightIndex(0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < filtered.length) {
            addTag(filtered[highlightIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightIndex(-1);
          break;
      }
    },
    [query, selected, isOpen, filtered, highlightIndex, addTag, removeTag]
  );

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightIndex >= 0 && listboxRef.current) {
      const el = listboxRef.current.children[highlightIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const listboxId = `tag-autocomplete-listbox-${label.replace(/\s+/g, "-")}`;

  return (
    <div ref={containerRef} className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-colors"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.chip}`}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 w-4 h-4"
              aria-label={`ลบ ${tag}`}
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.17 3.17a.75.75 0 011.06 0L6 4.94l1.77-1.77a.75.75 0 111.06 1.06L7.06 6l1.77 1.77a.75.75 0 11-1.06 1.06L6 7.06 4.23 8.83a.75.75 0 01-1.06-1.06L4.94 6 3.17 4.23a.75.75 0 010-1.06z" />
              </svg>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
          role="combobox"
          aria-expanded={isOpen && filtered.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightIndex >= 0
              ? `${listboxId}-option-${highlightIndex}`
              : undefined
          }
          aria-autocomplete="list"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          className="mt-1 max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {filtered.map((option, idx) => (
            <li
              key={option}
              id={`${listboxId}-option-${idx}`}
              role="option"
              aria-selected={highlightIndex === idx}
              className={`cursor-pointer px-3 py-2 text-sm ${
                highlightIndex === idx
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(option);
              }}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
