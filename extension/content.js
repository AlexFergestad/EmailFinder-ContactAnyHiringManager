// content.js

function extractProfileInfo() {
  const profileName = document.querySelector("h1")?.innerText || "";
  const jobTitle = document.querySelector(".text-body-medium")?.innerText || "";

  // Extract public links (emails or LinkedIn connections)
  const links = [];
  document.querySelectorAll("a").forEach(a => {
    const href = a.href;
    if (href && (href.startsWith("mailto:") || href.includes("linkedin.com/in/"))) {
      links.push(href);
    }
  });

  return {
    name: profileName,
    title: jobTitle,
    publicLinks: links
  };
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProfileInfo") {
    sendResponse(extractProfileInfo());
  }
});
