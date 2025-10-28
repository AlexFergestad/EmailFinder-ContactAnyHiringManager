// content.js

function extractProfileInfo() {
  // Wait for dynamic content to load (most profiles render within 1.5 seconds)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Profile Name: LinkedIn can use different classes depending on layout
      const profileName =
        document.querySelector("h1")?.innerText ||
        document.querySelector(".text-heading-xlarge")?.innerText ||
        "";

      // Job Title: classes may vary
      const jobTitle =
        document.querySelector(".text-body-medium.break-words")?.innerText ||
        document.querySelector(".text-body-medium")?.innerText ||
        "";

      // Extract public links (emails or LinkedIn URLs)
      const links = [];
      document.querySelectorAll("a").forEach((a) => {
        const href = a.href;
        if (href && (href.startsWith("mailto:") || href.includes("linkedin.com/in/"))) {
          links.push(href);
        }
      });

      resolve({
        name: profileName,
        title: jobTitle,
        publicLinks: links,
      });
    }, 1500); // wait 1.5 seconds for dynamic content
  });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProfileInfo") {
    extractProfileInfo().then((data) => sendResponse(data));
    return true; // keep the message channel open for async response
  }
});
