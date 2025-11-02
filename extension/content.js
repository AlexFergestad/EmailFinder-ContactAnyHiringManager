function extractProfileInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profileName =
        document.querySelector("h1")?.innerText ||
        document.querySelector(".text-heading-xlarge")?.innerText ||
        "";

      const jobTitle =
        document.querySelector(".text-body-medium.break-words")?.innerText ||
        document.querySelector(".text-body-medium")?.innerText ||
        "";

      const links = [];
      document.querySelectorAll("a").forEach(a => {
        const href = a.href;
        if (href && (href.startsWith("mailto:") || href.includes("linkedin.com/in/"))) {
          links.push(href);
        }
      });

      resolve({
        name: profileName,
        title: jobTitle,
        publicLinks: links
      });
    }, 1500);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProfileInfo") {
    extractProfileInfo().then(data => sendResponse(data));
    return true;
  }
});
