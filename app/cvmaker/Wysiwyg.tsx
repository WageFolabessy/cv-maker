"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function Wysiwyg({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (selectionRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
    editorRef.current?.focus();
  };

  const exec = (cmd: string, arg?: string) => {
    restoreSelection();
    document.execCommand(cmd, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const applyTextColor = (color: string) => {
    exec("foreColor", color);
  };

  const applyHighlight = (color: string) => {
    const cmd = document.queryCommandSupported("hiliteColor")
      ? "hiliteColor"
      : "backColor";
    exec(cmd, color);
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => exec("bold")}
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 italic cursor-pointer"
          onClick={() => exec("italic")}
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 underline cursor-pointer"
          onClick={() => exec("underline")}
        >
          U
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => exec("insertUnorderedList")}
        >
          • Bulleted list
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => exec("insertOrderedList")}
        >
          1. Numbered list
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => exec("formatBlock", "<h3>")}
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />
        <label
          title="Text color"
          className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
        >
          <span className="font-semibold">A</span>
          <input
            type="color"
            aria-label="Text color"
            className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
            onChange={(e) => applyTextColor(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </label>
        <label
          title="Highlight color"
          className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
        >
          <span className="px-1 rounded" style={{ backgroundColor: "#fff59d" }}>
            A
          </span>
          <input
            type="color"
            aria-label="Highlight color"
            className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
            onChange={(e) => applyHighlight(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </label>

        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          type="button"
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => exec("removeFormat")}
        >
          Clear
        </button>
      </div>

      <div
        ref={editorRef}
        role="textbox"
        aria-label="WYSIWYG editor"
        className="p-3 min-h-40 focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          saveSelection();
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder ?? "Type here..."}
      />
    </div>
  );
}