"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FileUploader from "./components/FileUploader";
import JobDescriptionInput from "./components/JobDescriptionInput";
import ResultsDisplay from "./components/ResultsDisplay";
import {
  DocumentTextIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleFileLoaded = (text, fileName) => {
    setResumeText(text);
    setResumeFileName(fileName);
    setAnalysisResults(null);
  };

  const handleDescriptionChange = (text) => {
    setJobDescription(text);
    setAnalysisResults(null);
  };

  const analyzeResume = async () => {
    if (!resumeText) {
      setError("Please upload a resume first");
      return;
    }

    if (!jobDescription) {
      setError("Please enter a job description");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError("Error analyzing resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const features = [
    {
      icon: <DocumentTextIcon className="h-6 w-6" />,
      title: "Resume Parsing",
      description:
        "Upload your resume in PDF or Word format and our system will extract and analyze its content.",
    },
    {
      icon: <DocumentMagnifyingGlassIcon className="h-6 w-6" />,
      title: "ATS Analysis",
      description:
        "Compare your resume against job descriptions to see how well it aligns with the requirements.",
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: "Recommendations",
      description:
        "Get actionable insights to improve your resume and increase your chances of getting past ATS filters.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block">Optimize Your Resume</span>
              <span className="block text-primary-600">
                Beat the ATS System
              </span>
            </motion.h1>
            <motion.p
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Match your resume against job descriptions to increase your
              chances of getting past Applicant Tracking Systems and landing
              interviews.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Resume Matcher</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploader onFileLoaded={handleFileLoaded} />
              <JobDescriptionInput
                onDescriptionChange={handleDescriptionChange}
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-danger-50 text-danger-700 rounded-lg border border-danger-200">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={analyzeResume}
                disabled={!resumeText || !jobDescription || isAnalyzing}
                className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-12 px-6 text-base ${
                  !resumeText || !jobDescription || isAnalyzing
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </div>

          <ResultsDisplay results={analysisResults} isLoading={isAnalyzing} />
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our advanced system helps you tailor your resume to specific job
              descriptions.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <div className="h-6 w-6 text-white">
                            {feature.icon}
                          </div>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              About Resume Matcher
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We help job seekers optimize their resumes for modern hiring
              systems.
            </p>
          </div>

          <div className="mt-10 bg-gray-50 rounded-2xl p-6 md:p-8">
            <p className="text-gray-700 mb-4">
              Today, more than 75% of resumes are rejected by Applicant Tracking
              Systems (ATS) before a human ever sees them. Resume Matcher helps
              you beat these systems by analyzing your resume against job
              descriptions and providing actionable feedback.
            </p>
            <p className="text-gray-700 mb-4">
              Our advanced natural language processing algorithms identify key
              requirements, skills, and keywords from job descriptions and check
              if your resume includes them. We also provide recommendations to
              improve your resume's content and formatting.
            </p>
            <p className="text-gray-700">
              By using Resume Matcher, you can increase your chances of getting
              past the ATS filters and landing more interviews.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
