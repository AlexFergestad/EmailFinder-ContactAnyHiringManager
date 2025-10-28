document.getElementById("scrapeBtn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Fetching profile info...</p>";

  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getProfileInfo" }, (data) => {
      if (!data) {
        resultsDiv.innerHTML = "<p style='color:red'>Could not read profile info.</p>";
        return;
      }

      // Display profile name and job title
      resultsDiv.innerHTML = `<h3>${data.name}</h3><p>${data.title}</p>`;

      // Display public links
      if (data.publicLinks.length > 0) {
        resultsDiv.innerHTML += "<h4>Public Links:</h4>";
        data.publicLinks.forEach(link => {
          const a = document.createElement("a");
          a.href = link;
          a.textContent = link;
          a.target = "_blank";
          resultsDiv.appendChild(a);
          resultsDiv.appendChild(document.createElement("br"));
        });
      } else {
        resultsDiv.innerHTML += "<p>No public links found.</p>";
      }
    });
  });
});
