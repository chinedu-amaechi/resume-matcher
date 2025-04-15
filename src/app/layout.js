import "./globals.css";

export const metadata = {
  title: "Resume Matcher - Optimize Your Resume for ATS",
  keywords:
    "resume matcher, ATS resume optimization, job application, resume matching tool, job description analysis",
  description:
    "Match your resume with job descriptions to increase your chances of getting past Applicant Tracking Systems (ATS).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-600">
                  Resume Matcher
                </span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="/"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-primary-500 text-sm font-medium text-gray-900"
                >
                  Home
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  How It Works
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  About
                </a>
              </nav>
            </div>
          </div>
        </header>

        {children}

        <footer className="bg-white mt-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start">
                <span className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Resume Matcher. All rights
                  reserved.
                </span>
              </div>
              <div className="flex justify-center md:justify-end mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 mr-4"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 mr-4"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
