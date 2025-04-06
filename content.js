// Debug logging function
function debugLog(message) {
    console.log(`[Vibe Agent Content] ${message}`);
}

// Variable to track if we've already detected the compose window
let composeDetected = false;

// Function to monitor Gmail compose window
function monitorGmailCompose() {
    debugLog('Starting Gmail compose monitor');
    
    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        // Check if compose window is open
        const composeWindow = document.querySelector('div[role="dialog"][aria-label*="New Message"]');
        
        if (composeWindow && !composeDetected) {
            debugLog('Compose window detected');
            composeDetected = true;
            // Notify background script
            chrome.runtime.sendMessage({ 
                action: "composeDetected" 
            }).catch(error => {
                debugLog('Error sending message: ' + error);
            });
        } else if (!composeWindow && composeDetected) {
            composeDetected = false;
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Start monitoring when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorGmailCompose);
} else {
    monitorGmailCompose();
}

// Let background script know content script is loaded
chrome.runtime.sendMessage({ action: "contentScriptLoaded" });

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message);
}); 