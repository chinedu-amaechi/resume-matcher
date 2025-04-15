const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  console.log("Creating uploads directory...");
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created successfully.");
} else {
  console.log("Uploads directory already exists.");
}

console.log("Setup complete!");
