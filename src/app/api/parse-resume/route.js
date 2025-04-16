import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { parseDocument, cleanDocumentText } from "@/lib/documentParser";
import fs from "fs/promises";

export async function POST(request) {
  try {
    // Try to parse the form data
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error("Error parsing form data:", formError);
      return NextResponse.json(
        { error: "Failed to parse form data: " + formError.message },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(
      "File received:",
      file.name,
      "Type:",
      file.type,
      "Size:",
      file.size
    );

    // Check file type - be more lenient with checks
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    // Check MIME type or file extension if MIME type fails
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isValidByExtension =
      fileExtension === "pdf" || fileExtension === "docx";
    const isValidByMime = validTypes.includes(file.type);

    if (!isValidByMime && !isValidByExtension) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a PDF or Word document",
          details: `File type: ${file.type}, Extension: ${fileExtension}`,
        },
        { status: 400 }
      );
    }

    // Determine the actual file type based on extension if MIME is uncertain
    const effectiveFileType = isValidByMime
      ? file.type
      : fileExtension === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // Limit file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Get the file buffer
    let buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log("File buffer created successfully, size:", buffer.length);
    } catch (bufferError) {
      console.error("Error creating buffer:", bufferError);
      return NextResponse.json(
        { error: "Failed to process file data: " + bufferError.message },
        { status: 500 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads");

    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log("Uploads directory ready at:", uploadsDir);
    } catch (mkdirError) {
      console.warn(
        "Directory exists or couldn't be created:",
        mkdirError.message
      );
      // Continue anyway as we'll process the buffer directly
    }

    // Save the file (optional - we'll continue even if this fails)
    let savedFilePath = null;
    try {
      const filePath = join(
        uploadsDir,
        file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      );
      await writeFile(filePath, buffer);
      savedFilePath = filePath;
      console.log("File saved successfully at:", filePath);
    } catch (saveError) {
      console.error("Error saving file:", saveError.message);
      // Continue with processing anyway since we have the buffer
    }

    // Parse document
    let extractedText;
    try {
      console.log("Attempting to parse document with type:", effectiveFileType);
      extractedText = await parseDocument(buffer, effectiveFileType);

      if (!extractedText || extractedText.trim() === "") {
        console.error("Document parsed but no text was extracted");
        return NextResponse.json(
          {
            error: "No text could be extracted from the document",
            details:
              "The file may be image-based, corrupted, or password-protected",
          },
          { status: 400 }
        );
      }

      console.log(
        "Document parsed successfully, text length:",
        extractedText.length
      );
    } catch (parseError) {
      console.error("Document parsing error:", parseError);

      // Attempt fallback parsing for Word documents if we have a saved file
      if (effectiveFileType.includes("word") && savedFilePath) {
        try {
          console.log(
            "Attempting fallback Word document parsing using file path"
          );
          // This would require adding a fallback method to the documentParser.js file
          // We'll just acknowledge it here for now
          return NextResponse.json(
            {
              error: "Failed to parse Word document: " + parseError.message,
              details:
                "Consider using a different Word document or converting to PDF format",
            },
            { status: 500 }
          );
        } catch (fallbackError) {
          console.error("Fallback parsing failed:", fallbackError);
        }
      }

      return NextResponse.json(
        {
          error: "Failed to parse document: " + parseError.message,
          fileInfo: {
            name: file.name,
            type: file.type,
            extension: fileExtension,
            size: file.size,
          },
        },
        { status: 500 }
      );
    }

    const cleanedText = cleanDocumentText(extractedText);
    console.log("Text cleaned successfully, final length:", cleanedText.length);

    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error("General error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file: " + error.message },
      { status: 500 }
    );
  }
}
