"use client";

import { motion } from "framer-motion";
import {
  SparklesIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  WrenchIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function RecommendationCard({ recommendation }) {
  const { type, title, description, items } = recommendation;

  // Get the appropriate icon based on the recommendation type
  const getIcon = () => {
    switch (type) {
      case "keywords":
        return <DocumentTextIcon className="h-6 w-6" />;
      case "skills":
        return <WrenchIcon className="h-6 w-6" />;
      case "education":
        return <AcademicCapIcon className="h-6 w-6" />;
      case "experience":
        return <BriefcaseIcon className="h-6 w-6" />;
      case "general":
        return <LightBulbIcon className="h-6 w-6" />;
      default:
        return <SparklesIcon className="h-6 w-6" />;
    }
  };

  // Get background color based on the recommendation type
  const getBackgroundColor = () => {
    switch (type) {
      case "keywords":
        return "bg-primary-50 text-primary-700 border-primary-200";
      case "skills":
        return "bg-secondary-50 text-secondary-700 border-secondary-200";
      case "education":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "experience":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "format":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "general":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div
      className={`rounded-xl bg-white shadow-md p-6 border ${getBackgroundColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-lg ${getBackgroundColor()} mr-4`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="mt-1 text-gray-700">{description}</p>

          {items && items.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <motion.li
                    key={index}
                    className="text-sm flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <span className="mr-2 text-lg">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
