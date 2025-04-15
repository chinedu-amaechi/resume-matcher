import { NextResponse } from "next/server";
import ResumeAnalyzer from "@/lib/resumeAnalyzer";

export async function POST(request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Analyze the resume
    const analyzer = new ResumeAnalyzer(resumeText, jobDescription);
    const analysis = analyzer.generateAnalysis();

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Error analyzing resume: " + error.message },
      { status: 500 }
    );
  }
}
