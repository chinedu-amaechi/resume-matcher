import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { parseDocument, cleanDocumentText } from "@/lib/documentParser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or Word document" },
        { status: 400 }
      );
    }

    // Limit file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Create a temporary file path for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads");
    const filePath = join(uploadsDir, file.name);

    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      // Continue with processing anyway since we have the buffer
    }

    // Parse document
    const extractedText = await parseDocument(buffer, file.type);
    const cleanedText = cleanDocumentText(extractedText);

    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file: " + error.message },
      { status: 500 }
    );
  }
}
