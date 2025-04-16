"use client";

import { motion } from "framer-motion";
import MatchPercentage from "./MatchPercentage";
import KeywordMatch from "./KeywordMatch";
import SkillsMatch from "./SkillsMatch";
import RecommendationCard from "./RecommendationCard";

export default function ResultsDisplay({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className="mt-8 space-y-6">
        <div className="rounded-xl bg-white shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="flex justify-center py-8">
              <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { matchPercentage, recommendations } = results;
  const { overall, keywordMatch, skillMatch } = matchPercentage;

  return (
    <motion.div
      className="mt-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-xl bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Resume Analysis Results</h2>

        <div className="flex justify-center mb-8">
          <MatchPercentage
            percentage={overall}
            title="Overall Match"
            subtitle={`Based on ${keywordMatch.total} keywords and ${skillMatch.total} skills`}
            size="large"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <MatchPercentage
              percentage={keywordMatch.percentage}
              title="Keyword Match"
              subtitle={`${keywordMatch.matched} of ${keywordMatch.total} keywords`}
            />
          </div>
          <div>
            <MatchPercentage
              percentage={skillMatch.percentage}
              title="Skill Match"
              subtitle={`${skillMatch.matched} of ${skillMatch.total} skills`}
            />
          </div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <KeywordMatch keywords={matchPercentage.keywords} />
        <SkillsMatch skills={matchPercentage.skills} />
      </motion.div>

      {recommendations && recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard key={index} recommendation={recommendation} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
