async function compareTexts() {
  const resumeText = document.getElementById("resumeText").value;
  const jobText = document.getElementById("jobText").value;

  if (!resumeText || !jobText) {
    alert("Please enter both your resume and the job description");
    return;
  }

  try {
    const response = await fetch("YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText: resumeText,
        jobText: jobText,
      }),
    });

    const data = await response.json();

    // Display results
    document.getElementById("matchScore").textContent =
      data.matchPercentage + "%";

    const matchedDiv = document.getElementById("matchedKeywords");
    matchedDiv.innerHTML = "";
    data.matched.forEach((word) => {
      const span = document.createElement("span");
      span.className = "keyword matched";
      span.textContent = word;
      matchedDiv.appendChild(span);
    });

    const missingDiv = document.getElementById("missingKeywords");
    missingDiv.innerHTML = "";
    data.missing.forEach((word) => {
      const span = document.createElement("span");
      span.className = "keyword missing";
      span.textContent = word;
      missingDiv.appendChild(span);
    });

    document.getElementById("results").style.display = "block";
  } catch (error) {
    alert("Error: " + error.message);
  }
}
