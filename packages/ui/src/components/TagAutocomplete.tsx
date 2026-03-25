"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Tag, type TagCategory } from "./Tag";

export interface TagOption {
  value: string;
  label: string;
}

export interface TagAutocompleteProps {
  options: TagOption[];
  selected: TagOption[];
  onChange: (selected: TagOption[]) => void;
  placeholder?: string;
  category?: TagCategory;
  className?: string;
  id?: string;
}

export function TagAutocomplete({
  options,
  selected,
  onChange,
  placeholder = "พิมพ์เพื่อค้นหา…",
  category = "skill",
  className,
  id = "tag-autocomplete",
}: TagAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = selected.map((t) => t.value);

  const filtered = options.filter(
    (opt) =>
      !selectedValues.includes(opt.value) &&
      opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const addTag = useCallback(
    (tag: TagOption) => {
      if (!selectedValues.includes(tag.value)) {
        onChange([...selected, tag]);
      }
      setQuery("");
      setHighlightIndex(-1);
      inputRef.current?.focus();
    },
    [selected, selectedValues, onChange]
  );

  const removeTag = useCallback(
    (value: string) => {
      onChange(selected.filter((t) => t.value !== value));
      inputRef.current?.focus();
    },
    [selected, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && query === "" && selected.length > 0) {
        const lastSelected = selected[selected.length - 1];
        if (lastSelected) removeTag(lastSelected.value);
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
            const item = filtered[highlightIndex];
            if (item) addTag(item);
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

  useEffect(() => {
    if (highlightIndex >= 0 && listboxRef.current) {
      const el = listboxRef.current.children[highlightIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

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

  const listboxId = `${id}-listbox`;

  return (
    <div ref={containerRef} className={cn("w-full relative", className)}>
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:border-blue-600 focus-within:ring-[3px] focus-within:ring-blue-200 transition-colors cursor-text"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {selected.map((tag) => (
          <Tag
            key={tag.value}
            label={tag.label}
            category={category}
            size="sm"
            onRemove={() => removeTag(tag.value)}
          />
        ))}

        <input
          ref={inputRef}
          id={id}
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
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400"
          role="combobox"
          aria-expanded={isOpen && filtered.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightIndex >= 0
              ? `${listboxId}-option-${highlightIndex}`
              : undefined
          }
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white shadow-md"
        >
          {filtered.map((option, idx) => (
            <li
              key={option.value}
              id={`${listboxId}-option-${idx}`}
              role="option"
              aria-selected={highlightIndex === idx}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm transition-colors",
                highlightIndex === idx
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(option);
              }}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
