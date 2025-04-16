const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadsDir)) {
    console.log("Creating uploads directory...");
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created successfully at:", uploadsDir);

    // Set directory permissions on Unix/Linux systems
    try {
      if (process.platform !== "win32") {
        fs.chmodSync(uploadsDir, 0o755);
        console.log("Directory permissions set to 755");
      }
    } catch (permError) {
      console.warn("Could not set directory permissions:", permError.message);
    }
  } else {
    console.log("Uploads directory already exists at:", uploadsDir);
  }

  // Test write access to the directory
  const testFile = path.join(uploadsDir, ".test-file");
  try {
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    console.log("Uploads directory is writable");
  } catch (writeError) {
    console.error(
      "WARNING: Uploads directory exists but may not be writable:",
      writeError.message
    );
    console.error("Please check directory permissions");
  }
} catch (error) {
  console.error("Error setting up uploads directory:", error.message);
  process.exit(1);
}

console.log("Setup complete!");
