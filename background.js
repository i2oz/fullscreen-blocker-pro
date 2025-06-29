chrome.runtime.onInstalled.addListener((details) => {
    // Set default states
    chrome.storage.sync.set({
        enabled: true,
        theme: 'auto',
        sessionsProtected: 1,
        attemptsBlocked: 0,
        whitelist: []
    });

    console.log('Fullscreen Blocker Pro initialized');

    // Show welcome notification on install
    if (details.reason === 'install') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: chrome.i18n.getMessage('extensionName'),
            message: chrome.i18n.getMessage('extensionInstalled')
        });
    }
});

// Handle extension state changes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getState') {
        chrome.storage.sync.get(['enabled'], (result) => {
            sendResponse({ enabled: result.enabled !== false });
        });
        return true;
    }

    if (request.action === 'setState') {
        chrome.storage.sync.set({ enabled: request.enabled }, () => {
            console.log(`Fullscreen Blocker Pro ${request.enabled ? 'enabled' : 'disabled'}`);

            // Update all tabs
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateState',
                        enabled: request.enabled
                    }).catch(() => {
                        // Ignore errors for tabs that can't receive messages
                    });
                });
            });

            // Update badge
            updateBadge(request.enabled);
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'blocked') {
        console.log('Fullscreen attempt blocked');

        // Show subtle badge indicator
        showBlockedIndicator();

        // Optional: Show notification for first few blocks
        chrome.storage.sync.get(['attemptsBlocked', 'showNotifications'], (result) => {
            const attempts = result.attemptsBlocked || 0;
            if (attempts < 3 && result.showNotifications !== false) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: chrome.i18n.getMessage('fullscreenBlocked'),
                    message: chrome.i18n.getMessage('fullscreenBlockedMessage'),
                    requireInteraction: false
                });

                // Auto-clear notification
                setTimeout(() => {
                    chrome.notifications.clear('blocked-notification');
                }, 3000);
            }
        });
    }

    if (request.action === 'checkWhitelist') {
        const hostname = request.hostname;
        chrome.storage.sync.get(['whitelist'], (result) => {
            const whitelist = result.whitelist || [];
            const isWhitelisted = whitelist.includes(hostname);
            sendResponse({ isWhitelisted: isWhitelisted });
        });
        return true;
    }
});

// Update icon and badge based on state
chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        updateIcon(changes.enabled.newValue);
        updateBadge(changes.enabled.newValue);
    }
});

function updateIcon(enabled) {
    const iconPath = enabled ? {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    } : {
        "16": "icons/icon16-disabled.png",
        "32": "icons/icon32-disabled.png",
        "48": "icons/icon48-disabled.png",
        "128": "icons/icon128-disabled.png"
    };

    chrome.action.setIcon({ path: iconPath });
}

function updateBadge(enabled) {
    if (enabled) {
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    } else {
        chrome.action.setBadgeText({ text: 'OFF' });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    }
}

function showBlockedIndicator() {
    chrome.action.setBadgeText({ text: '🛡️' });
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });

    // Reset badge after 2 seconds
    setTimeout(() => {
        chrome.storage.sync.get(['enabled'], (result) => {
            updateBadge(result.enabled !== false);
        });
    }, 2000);
}

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        chrome.storage.sync.get(['enabled'], (result) => {
            const newState = !result.enabled;
            chrome.storage.sync.set({ enabled: newState });
        });
    }
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(['enabled'], (result) => {
        updateIcon(result.enabled !== false);
        updateBadge(result.enabled !== false);
    });
});