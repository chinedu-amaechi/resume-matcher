import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Document Parser utility
 * Handles parsing of PDF and Word documents
 */
export async function parseDocument(file, fileType) {
  try {
    console.log("Starting document parsing, file type:", fileType);

    if (fileType.includes("pdf")) {
      return await parsePdf(file);
    } else if (fileType.includes("word") || fileType.includes("docx")) {
      return await parseWord(file);
    } else {
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
    // Set some options for pdf-parse to improve reliability
    const options = {
      max: 0, // No page limit
      timeout: 30000, // Increase timeout to 30 seconds
    };

    const data = await pdfParse(fileBuffer, options);

    if (!data || !data.text) {
      throw new Error("Failed to extract text from PDF");
    }

    console.log("PDF parsed successfully, text length:", data.text.length);
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
    console.log(
      "Attempting to parse Word document, buffer size:",
      fileBuffer.length
    );

    // Try with different extraction methods to improve reliability
    try {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
        includeDefaultStyleMap: true,
      });

      if (result && result.value && result.value.length > 0) {
        console.log(
          "Word document parsed successfully, text length:",
          result.value.length
        );
        return result.value;
      }
    } catch (firstError) {
      console.warn("First parsing attempt failed:", firstError.message);
    }

    // Second attempt with different options
    try {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
        convertImage: mammoth.images.imgElement(() => ({})),
        preserveEmptyParagraphs: true,
      });

      if (result && result.value && result.value.length > 0) {
        console.log(
          "Second parsing attempt succeeded, text length:",
          result.value.length
        );
        return result.value;
      }
    } catch (secondError) {
      console.warn("Second parsing attempt failed:", secondError.message);
    }

    // Final attempt with minimal options
    const result = await mammoth.extractRawText({ buffer: fileBuffer });

    if (!result || !result.value) {
      throw new Error(
        "Failed to extract text from Word document after multiple attempts"
      );
    }

    return result.value;
  } catch (error) {
    console.error("All Word document parsing attempts failed:", error);
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

  return text
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .trim() // Trim leading/trailing whitespace
    .normalize() // Normalize Unicode characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Remove control characters
    .replace(/ {2,}/g, " "); // Replace multiple spaces with a single space
}

/**
 * Extract sections from the resume text
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
