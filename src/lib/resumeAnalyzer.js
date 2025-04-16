import { WordTokenizer, TfIdf } from "natural";
import nlp from "compromise";

const tokenizer = new WordTokenizer();

/**
 * Resume Analyzer Class
 * Analyzes a resume against a job description to provide matching metrics and recommendations
 */
export default class ResumeAnalyzer {
  constructor(resumeText, jobDescriptionText) {
    this.resumeText = resumeText;
    this.jobDescriptionText = jobDescriptionText;
    this.tfidf = new TfIdf();

    // Process the texts
    this.processTexts();
  }

  /**
   * Process and normalize the text data
   */
  processTexts() {
    // Normalize texts by converting to lowercase
    this.resumeTextNormalized = this.resumeText.toLowerCase();
    this.jobDescriptionTextNormalized = this.jobDescriptionText.toLowerCase();

    // Tokenize texts
    this.resumeTokens = tokenizer.tokenize(this.resumeTextNormalized);
    this.jobDescriptionTokens = tokenizer.tokenize(
      this.jobDescriptionTextNormalized
    );

    // Add documents to TF-IDF
    this.tfidf.addDocument(this.resumeTextNormalized);
    this.tfidf.addDocument(this.jobDescriptionTextNormalized);
  }

  /**
   * Extract keywords from job description
   */
  extractKeywords() {
    const keywordImportance = {};
    const keywordMatches = {};

    // Extract important terms from job description using TF-IDF
    this.tfidf
      .listTerms(1)
      .slice(0, 30)
      .forEach((item) => {
        const term = item.term;
        // Filter out very short terms and common words
        if (term.length > 2) {
          keywordImportance[term] = item.tfidf;
          // Check if the keyword exists in the resume
          keywordMatches[term] = this.resumeTextNormalized.includes(term);
        }
      });

    // Common skills-related terms
    const skillsTerms = [
      "proficient in",
      "experience with",
      "knowledge of",
      "skilled in",
      "familiar with",
      "expertise in",
      "ability to",
      "understanding of",
      "competent in",
      "fluent in",
      "trained in",
      "certified in",
    ];

    // Extract skills mentioned in job description
    const skills = {};

    // Look for skill phrases
    const skillsRegex = new RegExp(
      `(${skillsTerms.join("|")})\\s+([\\w\\s,]+)`,
      "gi"
    );
    const skillsMatches = this.jobDescriptionText.match(skillsRegex) || [];

    skillsMatches.forEach((match) => {
      const skillText = match
        .replace(
          /^.*?(proficient in|experience with|knowledge of|skilled in|familiar with|expertise in|ability to|understanding of|competent in|fluent in|trained in|certified in)\s+/i,
          ""
        )
        .trim();
      if (skillText.length > 2) {
        skills[skillText] = this.resumeTextNormalized.includes(
          skillText.toLowerCase()
        );
      }
    });

    // Look for technical skills (often single words or acronyms)
    const technicalSkillsSection = this.jobDescriptionText.match(
      /technical\s+skills.*?(:|required|preferred)/i
    );
    if (technicalSkillsSection) {
      const techSkillsText = technicalSkillsSection[0];
      const techSkills =
        techSkillsText.match(/\b[A-Za-z][A-Za-z0-9+#.]+\b/g) || [];

      techSkills.forEach((skill) => {
        if (skill.length > 1 && !skillsTerms.includes(skill.toLowerCase())) {
          skills[skill] = this.resumeTextNormalized.includes(
            skill.toLowerCase()
          );
        }
      });
    }

    // Look for lists of technologies/frameworks/languages
    const techLists =
      this.jobDescriptionText.match(
        /\b(languages|frameworks|technologies|tools|platforms|environments|software|systems)\s*:.*$/gim
      ) || [];
    techLists.forEach((list) => {
      const items = list.split(/[:;,]/).slice(1);
      items.forEach((item) => {
        const skill = item.trim();
        if (skill.length > 1) {
          skills[skill] = this.resumeTextNormalized.includes(
            skill.toLowerCase()
          );
        }
      });
    });

    return {
      keywords: keywordMatches,
      skills,
    };
  }

  /**
   * Calculate the match percentage between resume and job description
   */
  calculateMatchPercentage() {
    const { keywords, skills } = this.extractKeywords();

    // Count matches
    const keywordMatchCount = Object.values(keywords).filter(Boolean).length;
    const keywordTotal = Object.keys(keywords).length;

    const skillMatchCount = Object.values(skills).filter(Boolean).length;
    const skillTotal = Object.keys(skills).length;

    // Calculate weighted match percentage
    const keywordWeight = 0.4;
    const skillWeight = 0.6;

    const keywordPercentage =
      keywordTotal > 0 ? (keywordMatchCount / keywordTotal) * 100 : 0;
    const skillPercentage =
      skillTotal > 0 ? (skillMatchCount / skillTotal) * 100 : 0;

    const overallPercentage =
      keywordPercentage * keywordWeight + skillPercentage * skillWeight;

    return {
      overall: Math.round(overallPercentage),
      keywordMatch: {
        percentage: Math.round(keywordPercentage),
        matched: keywordMatchCount,
        total: keywordTotal,
      },
      skillMatch: {
        percentage: Math.round(skillPercentage),
        matched: skillMatchCount,
        total: skillTotal,
      },
      keywords,
      skills,
    };
  }

  /**
   * Generate recommendations based on the analysis
   */
  generateRecommendations() {
    const matchPercentage = this.calculateMatchPercentage();
    const { keywords, skills } = matchPercentage;

    const missingKeywords = Object.entries(keywords)
      .filter(([_, isMatched]) => !isMatched)
      .map(([keyword]) => keyword);

    const missingSkills = Object.entries(skills)
      .filter(([_, isMatched]) => !isMatched)
      .map(([skill]) => skill);

    const recommendations = [];

    // Add recommendations based on missing keywords
    if (missingKeywords.length > 0) {
      recommendations.push({
        type: "keywords",
        title: "Add Missing Keywords",
        description:
          "Consider adding these important keywords from the job description:",
        items: missingKeywords.slice(0, 10), // Limit to top 10 to avoid overwhelming the user
      });
    }

    // Add recommendations based on missing skills
    if (missingSkills.length > 0) {
      recommendations.push({
        type: "skills",
        title: "Highlight Relevant Skills",
        description:
          "Try to include these skills that are mentioned in the job description:",
        items: missingSkills.slice(0, 10), // Limit to top 10
      });
    }

    // Check resume length and generate recommendations
    const resumeWordCount = this.resumeTokens.length;
    if (resumeWordCount < 300) {
      recommendations.push({
        type: "format",
        title: "Expand Your Resume",
        description:
          "Your resume seems too short. Consider adding more details about your achievements and experience.",
        items: [
          "Add specific accomplishments with metrics when possible",
          "Include relevant projects or professional development",
          "Elaborate on your most relevant experiences",
          "Add a professional summary section if not present",
        ],
      });
    } else if (resumeWordCount > 1000) {
      recommendations.push({
        type: "format",
        title: "Condense Your Resume",
        description:
          "Your resume is quite lengthy. Consider focusing on the most relevant experience and skills for this position.",
        items: [
          "Remove outdated or irrelevant experiences",
          "Focus on accomplishments rather than just responsibilities",
          "Use bullet points instead of paragraphs",
          "Aim for 1-2 pages maximum",
        ],
      });
    }

    // Check for action verbs
    const actionVerbs = [
      "achieved",
      "improved",
      "trained",
      "managed",
      "created",
      "resolved",
      "delivered",
      "increased",
      "decreased",
      "developed",
      "implemented",
      "coordinated",
      "generated",
      "reduced",
      "negotiated",
      "led",
      "presented",
      "organized",
      "designed",
      "established",
      "streamlined",
      "launched",
    ];

    const actionVerbsFound = actionVerbs.filter((verb) =>
      this.resumeTextNormalized.includes(verb)
    );

    if (actionVerbsFound.length < 5) {
      recommendations.push({
        type: "general",
        title: "Use Strong Action Verbs",
        description:
          "Your resume could benefit from more powerful action verbs to describe your achievements and responsibilities.",
        items: [
          'Replace passive language with action verbs like "achieved," "improved," "delivered," etc.',
          "Start bullet points with strong verbs in the past tense",
          'Quantify your achievements whenever possible (e.g., "Increased sales by 20%")',
        ],
      });
    }

    // Add general recommendations based on overall match
    const overallMatch = matchPercentage.overall;
    if (overallMatch < 50) {
      recommendations.push({
        type: "general",
        title: "Tailor Your Resume",
        description:
          "Your resume needs significant improvement to match this job description. Consider restructuring it to highlight relevant experience and skills.",
        items: [
          "Reorder sections to prioritize most relevant experiences",
          "Mirror the language used in the job description",
          "Create a targeted professional summary that aligns with the role",
          "Consider a skills-focused format if your direct experience is limited",
        ],
      });
    } else if (overallMatch < 70) {
      recommendations.push({
        type: "general",
        title: "Enhance Your Resume",
        description:
          "Your resume partially matches the job description. Add more specific accomplishments that demonstrate the required skills.",
        items: [
          "Focus on achievements that demonstrate the required skills",
          "Add industry-specific terminology where appropriate",
          "Ensure your most relevant experience is prominently featured",
          'Consider adding a "Core Competencies" section to highlight key skills',
        ],
      });
    }

    return recommendations;
  }

  /**
   * Generate a complete analysis
   */
  generateAnalysis() {
    const matchPercentage = this.calculateMatchPercentage();
    const recommendations = this.generateRecommendations();

    return {
      matchPercentage,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }
}
