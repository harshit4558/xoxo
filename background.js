// Base64 encoded small colored square as icon (you can replace this with your actual icon later)


// Debug logging function
function debugLog(message) {
    console.log(`[Vibe Agent Debug] ${message}`);
}

// Initialize the extension
debugLog('Background script loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "composeDetected") {
        debugLog('Compose window detected');
        // Show the pencil icon
        chrome.action.setBadgeText({ 
            tabId: sender.tab.id, 
            text: "✎" 
        });
        chrome.action.setBadgeBackgroundColor({ 
            tabId: sender.tab.id, 
            color: "#4285f4" 
        });
        
        // Trigger the popup
        chrome.action.setPopup({ 
            tabId: sender.tab.id, 
            popup: 'popup.html' 
        });
        
        // Programmatically click the extension icon
        chrome.action.openPopup().catch(error => {
            debugLog('Could not open popup automatically: ' + error);
        });
    }
});

// Function to handle compose state
function handleComposeState(tabId, isComposing) {
    if (isComposing) {
        debugLog('Compose window detected - Updating extension state');
        // Update the extension state
        chrome.action.setPopup({ tabId: tabId, popup: 'popup.html' });
        // Make the extension icon noticeable
        chrome.action.setBadgeText({ tabId: tabId, text: "✎" });
        chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#4285f4" });
        // Programmatically click the extension icon
        chrome.action.getUserSettings().then(settings => {
            chrome.tabs.sendMessage(tabId, { action: "openPopup" });
        });
    } else {
        // Clear the badge when not composing
        chrome.action.setBadgeText({ tabId: tabId, text: "" });
    }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    debugLog(`Tab updated - Status: ${changeInfo.status}, URL: ${tab.url}`);
    
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if we're in Gmail and specifically in compose mode
        const isGmail = tab.url.includes('mail.google.com');
        const isComposing = tab.url.includes('compose=new');
        
        if (isGmail) {
            debugLog(`Gmail detected - Compose mode: ${isComposing}`);
            handleComposeState(tabId, isComposing);
        }
    }
});

// Listen for tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    debugLog('Tab activated');
    
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        debugLog(`Activated tab URL: ${tab.url}`);
        
        if (tab.url) {
            const isGmail = tab.url.includes('mail.google.com');
            const isComposing = tab.url.includes('compose=new');
            
            if (isGmail) {
                debugLog(`Gmail detected - Compose mode: ${isComposing}`);
                handleComposeState(tab.id, isComposing);
            }
        }
    } catch (error) {
        debugLog(`Error checking tab: ${error.message}`);
    }
}); 