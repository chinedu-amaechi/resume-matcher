"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function FileUploader({ onFileLoaded, className = "" }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      // Check file extension
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      const isValidExtension = ["pdf", "docx"].includes(fileExtension);

      if (!isValidExtension) {
        setError(`Unsupported file format: .${fileExtension}`);
        setErrorDetails("Please upload a PDF (.pdf) or Word (.docx) document.");
        setFile(null);
        setFileName("");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setErrorDetails("");
      setSuccess(false);
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Log the file type and size for debugging
        console.log(
          "Uploading file:",
          selectedFile.name,
          "Type:",
          selectedFile.type,
          "Size:",
          selectedFile.size
        );

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        // Handle non-JSON responses (like HTML error pages)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned non-JSON response: ${contentType}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to process file");
        }

        if (!data.text) {
          throw new Error("No text was extracted from the document");
        }

        setSuccess(true);
        onFileLoaded(data.text, selectedFile.name);
      } catch (err) {
        console.error("Error processing file:", err);

        // Check if the error is a SyntaxError (failed to parse JSON)
        if (err instanceof SyntaxError) {
          setError("Server returned an invalid response");
          setErrorDetails(
            "The server might be encountering an error with this document."
          );
        } else {
          setError(err.message || "Error processing file");
          setErrorDetails(
            "Please try a different document or convert to PDF format."
          );
        }

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
      // Fallback for some browsers that might not correctly identify MIME types
      ".pdf": [],
      ".docx": [],
    },
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileName("");
    setSuccess(false);
    setError("");
    setErrorDetails("");
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
          <div className="mt-2 text-sm text-danger-600">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {errorDetails && (
              <p className="mt-1 ml-5 text-xs text-danger-500">
                {errorDetails}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
