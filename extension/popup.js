document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const company = document.getElementById("company").value;
  const url = document.getElementById("url").value;
  const resultsDiv = document.getElementById("results");

  if (!company || !url) {
    resultsDiv.innerHTML = "<p style='color:red'>Please enter both fields.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Scraping... please wait.</p>";

  try {
    const response = await fetch(`http://127.0.0.1:5000/scrape?company=${company}&url=${url}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p style='color:red'>${data.error}</p>`;
      return;
    }

    if (data.length === 0) {
      resultsDiv.innerHTML = "<p>No recruiter links found.</p>";
      return;
    }

    // Display results
    resultsDiv.innerHTML = "<h3>Results:</h3>";
    data.forEach(item => {
      const link = document.createElement("a");
      link.href = item.contact_link;
      link.target = "_blank";
      link.textContent = `${item.contact_text || "Recruiting Contact"}`;
      resultsDiv.appendChild(link);
      resultsDiv.appendChild(document.createElement("br"));
    });
  } catch (error) {
    resultsDiv.innerHTML = `<p style='color:red'>Error connecting to backend.</p>`;
  }
});
