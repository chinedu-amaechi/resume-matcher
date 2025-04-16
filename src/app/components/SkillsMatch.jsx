"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function SkillsMatch({ skills, title = "Skills Match" }) {
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No skills analyzed yet.</p>
      </div>
    );
  }

  const matchedSkills = Object.entries(skills).filter(
    ([_, matched]) => matched
  );
  const missingSkills = Object.entries(skills).filter(
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
    <div className="rounded-xl bg-white shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            Skills in Your Resume
          </h4>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-success-100 text-success-800">
            {matchedSkills.length} of {Object.keys(skills).length}
          </span>
        </div>

        {matchedSkills.length > 0 ? (
          <motion.div
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matchedSkills.map(([skill], index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center p-3 rounded-lg bg-success-50 border border-success-200"
              >
                <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-success-900">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
            No skill matches found. Consider highlighting relevant skills in
            your resume.
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Skills to Add</h4>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-danger-100 text-danger-800">
            {missingSkills.length} of {Object.keys(skills).length}
          </span>
        </div>

        {missingSkills.length > 0 ? (
          <motion.div
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {missingSkills.map(([skill], index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center p-3 rounded-lg bg-danger-50 border border-danger-200"
              >
                <XCircleIcon className="h-5 w-5 text-danger-600 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-danger-900">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
            Great job! You've included all the important skills from the job
            description.
          </p>
        )}
      </div>
    </div>
  );
}
