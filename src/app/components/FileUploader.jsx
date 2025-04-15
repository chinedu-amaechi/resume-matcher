"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function FileUploader({ onFileLoaded, className = "" }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Word document");
        setFile(null);
        setFileName("");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setSuccess(false);
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error((await response.text()) || "Failed to upload file");
        }

        const data = await response.json();
        setSuccess(true);
        onFileLoaded(data.text, selectedFile.name);
      } catch (err) {
        console.error("Error processing file:", err);
        setError(err.message || "Error processing file. Please try again.");
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    [onFileLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileName("");
    setSuccess(false);
    setError("");
  };

  return (
    <div className={`${className}`}>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer
          ${
            isDragActive
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }
          ${
            error
              ? "border-danger-300 bg-danger-50 hover:border-danger-400 hover:bg-danger-50"
              : ""
          }
          ${
            success
              ? "border-success-300 bg-success-50 hover:border-success-400 hover:bg-success-50"
              : ""
          }
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />

        {isLoading ? (
          <div className="flex flex-col items-center text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-3"></div>
            <p className="text-sm text-gray-600">Processing your resume...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {fileName}
              </span>
              <button
                onClick={removeFile}
                className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {success && (
              <div className="flex items-center text-success-600">
                <CheckCircleIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">Resume parsed successfully!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-3" />
            <p className="mb-2 text-sm font-medium text-gray-900">
              {isDragActive ? "Drop your resume here" : "Upload your resume"}
            </p>
            <p className="text-xs text-gray-500">
              PDF or Word document (max 5MB)
            </p>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-danger-600 flex items-center">
            <XMarkIcon className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
