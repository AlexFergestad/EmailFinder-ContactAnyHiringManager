let lastProfile = null;
let candidateList = [];

// LinkedIn Profile Extraction Down Here
document.getElementById("scrapeBtn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Fetching profile info...</p>";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getProfileInfo" }, (data) => {
      if (!data) {
        resultsDiv.innerHTML = "<p style='color:red'>Could not read profile info.</p>";
        return;
      }

      lastProfile = data;

      resultsDiv.innerHTML = `<h3>${data.name}</h3><p>${data.title}</p>`;

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

// Generate candidate emails from LinkedIn profile
document.getElementById("generateEmailsBtn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("results");
  if (!lastProfile || !lastProfile.name || !lastProfile.title) {
    resultsDiv.innerHTML = "<p>Please fetch a profile first.</p>";
    return;
  }

  const nameParts = lastProfile.name.split(" ");
  if (nameParts.length < 2) {
    resultsDiv.innerHTML = "<p>Could not parse full name.</p>";
    return;
  }
  const first = nameParts[0].toLowerCase();
  const last = nameParts[nameParts.length - 1].toLowerCase();

  const companyMatch = lastProfile.title.match(/at\s+(.*)$/i);
  const domain = companyMatch ? companyMatch[1].replace(/\s+/g, "").toLowerCase() + ".com" : "example.com";

  const patterns = [
    `${first}.${last}@${domain}`,
    `${first}@${domain}`,
    `${first[0]}.${last}@${domain}`,
    `${first}${last[0]}@${domain}`
  ];

  lastProfile.emails = patterns; // store candidate emails

  resultsDiv.innerHTML += `<h4>Candidate Emails for ${lastProfile.name}:</h4>`;
  patterns.forEach(email => {
    const a = document.createElement("a");
    a.href = `mailto:${email}`;
    a.textContent = email;
    a.target = "_blank";
    resultsDiv.appendChild(a);
    resultsDiv.appendChild(document.createElement("br"));
  });
});

// Add current profile to candidate list
document.getElementById("addToListBtn").addEventListener("click", () => {
  if (!lastProfile) return alert("Fetch a profile first.");

  candidateList.push(lastProfile);
  displayCandidateList();
});

// Display candidate list
function displayCandidateList() {
  const listDiv = document.getElementById("candidateList");
  listDiv.innerHTML = "";
  candidateList.forEach((candidate, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${candidate.name}</strong> (${candidate.title}) <br> Emails: ${candidate.emails ? candidate.emails.join(", ") : "N/A"}`;
    listDiv.appendChild(div);
    listDiv.appendChild(document.createElement("hr"));
  });
}

// Export candidate list to CSV
document.getElementById("exportCSVBtn").addEventListener("click", () => {
  if (candidateList.length === 0) return alert("No candidates to export.");

  const rows = [
    ["Name", "Title", "Emails"]
  ];

  candidateList.forEach(c => {
    rows.push([c.name, c.title, c.emails ? c.emails.join("; ") : ""]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "candidate_list.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Company-wide email pattern generator (same as before)
const companyDomains = {
  "hudl": "hudl.com",
  "google": "google.com",
  "spotify": "spotify.com",
  "linkedin": "linkedin.com"
};

document.getElementById("generateCompanyEmailBtn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("companyResults");
  const companyInput = document.getElementById("companyName").value.trim().toLowerCase();
  const firstName = document.getElementById("firstName").value.trim().toLowerCase();
  const lastName = document.getElementById("lastName").value.trim().toLowerCase();

  if (!companyInput || !firstName || !lastName) {
    resultsDiv.innerHTML = "<p>Please enter company, first name, and last name.</p>";
    return;
  }

  const domain = companyDomains[companyInput] || companyInput.replace(/\s+/g,"") + ".com";

  const patterns = [
    `${firstName}.${lastName}@${domain}`,
    `${firstName}@${domain}`,
    `${firstName[0]}.${lastName}@${domain}`,
    `${firstName}${lastName[0]}@${domain}`
  ];

  resultsDiv.innerHTML = `<h4>Candidate Emails for ${firstName} ${lastName} at ${companyInput}:</h4>`;
  patterns.forEach(email => {
    const a = document.createElement("a");
    a.href = `mailto:${email}`;
    a.textContent = email;
    a.target = "_blank";
    resultsDiv.appendChild(a);
    resultsDiv.appendChild(document.createElement("br"));
  });
});
