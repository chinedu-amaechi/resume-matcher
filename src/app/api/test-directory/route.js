import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import fs from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const testFile = formData.get("testFile");

    if (!testFile) {
      return NextResponse.json(
        { error: "No test file provided" },
        { status: 400 }
      );
    }

    // Get the uploads directory
    const uploadsDir = join(process.cwd(), "uploads");

    // Try to create the directory if it doesn't exist
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      return NextResponse.json(
        {
          error: `Failed to create uploads directory: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // Check if directory exists
    try {
      const stats = await fs.stat(uploadsDir);
      if (!stats.isDirectory()) {
        return NextResponse.json(
          {
            error: "The uploads path exists but is not a directory",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: `Cannot access uploads directory: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // Try to write a test file
    try {
      const bytes = await testFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const testFilePath = join(uploadsDir, ".test-file-" + Date.now());
      await writeFile(testFilePath, buffer);

      // Clean up the test file
      await fs.unlink(testFilePath);

      return NextResponse.json({
        success: true,
        message: "Uploads directory is working correctly",
        directory: uploadsDir,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: `Failed to write to uploads directory: ${error.message}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error testing directory: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
