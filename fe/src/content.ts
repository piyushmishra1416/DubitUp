// src/content.ts
console.log("Content script loaded!");

function getCurrentTime(): string {
  const video = document.querySelector('video');
  if (video) {
    const currentTime = video.currentTime;
    return new Date(currentTime * 1000).toISOString().substr(11, 8); // format as HH:MM:SS
  }
  return "00:00:00";
}

// Listen for messages from the background or popup scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getCurrentTime") {
    const currentTime = getCurrentTime();
    sendResponse({ currentTime });
  }
});
