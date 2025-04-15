"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function KeywordMatch({ keywords, title = "Keyword Matches" }) {
  if (!keywords || Object.keys(keywords).length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No keywords analyzed yet.</p>
      </div>
    );
  }

  const matchedKeywords = Object.entries(keywords).filter(
    ([_, matched]) => matched
  );
  const missingKeywords = Object.entries(keywords).filter(
    ([_, matched]) => !matched
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            Matched Keywords
          </h4>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-success-100 text-success-800">
            {matchedKeywords.length} of {Object.keys(keywords).length}
          </span>
        </div>

        {matchedKeywords.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matchedKeywords.map(([keyword], index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center p-2 rounded-lg bg-success-50 border border-success-200"
              >
                <CheckCircleIcon className="h-4 w-4 text-success-600 mr-1.5 flex-shrink-0" />
                <span className="text-sm font-medium text-success-900 truncate">
                  {keyword}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
            No keyword matches found. Consider adding relevant keywords to your
            resume.
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            Missing Keywords
          </h4>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-danger-100 text-danger-800">
            {missingKeywords.length} of {Object.keys(keywords).length}
          </span>
        </div>

        {missingKeywords.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {missingKeywords.map(([keyword], index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center p-2 rounded-lg bg-danger-50 border border-danger-200"
              >
                <XCircleIcon className="h-4 w-4 text-danger-600 mr-1.5 flex-shrink-0" />
                <span className="text-sm font-medium text-danger-900 truncate">
                  {keyword}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
            Great job! You've included all the important keywords.
          </p>
        )}
      </div>
    </div>
  );
}
