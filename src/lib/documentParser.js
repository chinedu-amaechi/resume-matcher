import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Document Parser utility
 * Handles parsing of PDF and Word documents
 */
export async function parseDocument(file, fileType) {
  try {
    switch (fileType) {
      case "application/pdf":
        return await parsePdf(file);
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await parseWord(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error(`Failed to parse document: ${error.message}`);
  }
}

/**
 * Parse PDF document
 * @param {Buffer} fileBuffer - Buffer containing the PDF file
 * @returns {Promise<string>} Extracted text from the PDF
 */
async function parsePdf(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Parse Word document
 * @param {Buffer} fileBuffer - Buffer containing the Word document
 * @returns {Promise<string>} Extracted text from the Word document
 */
async function parseWord(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error("Error parsing Word document:", error);
    throw new Error(`Failed to parse Word document: ${error.message}`);
  }
}

/**
 * Clean and normalize text extracted from documents
 * @param {string} text - Raw text extracted from document
 * @returns {string} Cleaned and normalized text
 */
export function cleanDocumentText(text) {
  if (!text) return "";

  return (
    text
      // Replace multiple whitespace characters (including newlines) with a single space
      .replace(/\s+/g, " ")
      // Trim leading and trailing whitespace
      .trim()
      // Normalize unicode characters
      .normalize()
      // Remove any control characters
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
  );
}

/**
 * Extract sections from the resume text
 * This is a basic implementation and could be enhanced with more sophisticated NLP
 * @param {string} resumeText - The full text of the resume
 * @returns {Object} An object containing different sections of the resume
 */
export function extractResumeSections(resumeText) {
  if (!resumeText) return {};

  // Common section headers in resumes
  const sectionPatterns = {
    education:
      /\b(education|academic background|academic qualifications|academic history|degrees|educational background)\b/i,
    experience:
      /\b(experience|work experience|employment|work history|professional experience|professional background)\b/i,
    skills:
      /\b(skills|technical skills|core competencies|key skills|qualifications|areas of expertise|areas of experience|areas of knowledge)\b/i,
    projects:
      /\b(projects|key projects|project experience|professional projects)\b/i,
    certifications:
      /\b(certifications|certificates|professional certifications|accreditations|licenses)\b/i,
    summary:
      /\b(summary|professional summary|career summary|profile|professional profile|career objective|objective)\b/i,
  };

  const sections = {};
  const lines = resumeText.split("\n");

  let currentSection = "other";
  sections[currentSection] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this line is a section header
    let foundSection = false;
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmedLine)) {
        currentSection = sectionName;
        sections[currentSection] = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection) {
      sections[currentSection].push(trimmedLine);
    }
  }

  // Join each section's lines into a single string
  for (const section in sections) {
    sections[section] = sections[section].join(" ");
  }

  return sections;
}
