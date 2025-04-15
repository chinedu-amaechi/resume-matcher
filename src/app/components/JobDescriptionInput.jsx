"use client";

import { useState } from "react";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function JobDescriptionInput({
  onDescriptionChange,
  className = "",
}) {
  const [description, setDescription] = useState("");
  const [isClipboardCopied, setIsClipboardCopied] = useState(false);

  const handleChange = (e) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDescription(text);
        onDescriptionChange(text);
        setIsClipboardCopied(true);
        setTimeout(() => setIsClipboardCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-2 flex justify-between items-center">
        <label
          htmlFor="job-description"
          className="block text-sm font-medium text-gray-700"
        >
          Job Description
        </label>
        <button
          type="button"
          onClick={handlePaste}
          className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700"
        >
          {isClipboardCopied ? (
            <>
              <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
              Pasted!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
              Paste from Clipboard
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <textarea
          id="job-description"
          value={description}
          onChange={handleChange}
          placeholder="Paste the job description here..."
          className="textarea"
          rows={12}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Paste the complete job description including requirements,
        responsibilities, and qualifications.
      </p>
    </div>
  );
}
