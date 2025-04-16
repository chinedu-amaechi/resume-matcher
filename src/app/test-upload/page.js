"use client";

import { useState } from "react";
import FileUploader from "@/app/components/FileUploader";

export default function TestUploadPage() {
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      { time: new Date().toLocaleTimeString(), message },
    ]);
  };

  const handleFileLoaded = (text, name) => {
    setFileText(text);
    setFileName(name);
    addLog(`File parsed successfully: ${name} (${text.length} characters)`);
  };

  const handleTestDirectory = async () => {
    addLog("Testing uploads directory...");

    try {
      // Create a simple test FormData with a text file
      const formData = new FormData();
      const testBlob = new Blob(["This is a test file"], {
        type: "text/plain",
      });
      formData.append("testFile", testBlob, "test.txt");

      // Try to save it via a fetch request
      const response = await fetch("/api/test-directory", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        addLog(`Directory test successful: ${data.message}`);
      } else {
        addLog(`Directory test failed: ${data.error}`);
      }
    } catch (error) {
      addLog(`Error testing directory: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            File Upload Test Page
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload a Resume File
              </h2>

              <div className="mb-4">
                <button
                  onClick={handleTestDirectory}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 mb-4"
                >
                  Test Uploads Directory
                </button>
              </div>

              <FileUploader onFileLoaded={handleFileLoaded} />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Extracted Text
              </h2>

              {fileName ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {fileName}
                  </h3>
                  <div className="bg-white border border-gray-300 rounded-md p-3 max-h-72 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap">
                      {fileText.substring(0, 1000)}
                      {fileText.length > 1000 ? "... (truncated)" : ""}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-gray-500">
                  No file uploaded yet
                </div>
              )}

              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Logs</h2>
                <div className="bg-gray-800 text-gray-100 rounded-md p-3 max-h-72 overflow-y-auto">
                  {logs.length > 0 ? (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono">
                          <span className="text-gray-400">[{log.time}]</span>{" "}
                          <span>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs">No logs yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
