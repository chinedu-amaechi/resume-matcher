# Resume Matcher - Serverless Edition

A serverless application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). This app can be deployed directly to Vercel without any additional server configuration.

## Features

- Upload and parse PDF or Word (DOCX) resumes
- Extract text from uploaded documents
- Compare resume content with job descriptions
- Identify matching keywords and skills
- Generate recommendations to improve your resume
- Completely serverless - no server setup required

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React** - UI components and state management
- **Tailwind CSS** - Styling and UI components
- **Mammoth.js** - Word document parsing
- **PDF-parse** - PDF document parsing
- **Natural** - Natural language processing for text analysis
- **Compromise** - Text parsing and entity recognition
- **Framer Motion** - Animations and transitions
- **React Dropzone** - File upload handling
- **Recharts** - Data visualization

## Serverless Architecture

This application is designed to run in a serverless environment like Vercel:

- Files are processed entirely in memory without writing to disk
- All text extraction and analysis happens within the function execution context
- No databases or persistent storage required
- API routes are optimized for serverless environments

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/resume-matcher.git
   cd resume-matcher
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Deployment to Vercel

This application is designed to be deployed directly to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy with default settings (no environment variables required)

Alternatively, you can use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## How It Works

1. **Resume Upload**: Users upload their resume in PDF or DOCX format
2. **Text Extraction**: The serverless function extracts and cleans text from the document
3. **Job Description Input**: Users enter the job description they're applying for
4. **Analysis**: The app analyzes keyword and skill matches between the resume and job description
5. **Results**: Users receive a match percentage and recommendations for improvement

## File Size Limits

- Maximum file size: 5MB
- Supported formats: PDF (.pdf) and Word (.docx)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.