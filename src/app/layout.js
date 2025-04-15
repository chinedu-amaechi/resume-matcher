import "./globals.css";

export const metadata = {
  title: "Resume Matcher",
  author: "Chinedu Amaechi",
  keywords: ["resume", "ATS", "matcher", "job application", "optimization"],
  description:
    "Resume Matcher: Optimize resumes for ATS compatibility effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
