(function () {
    'use strict';

    let enabled = true;
    let injectedScript = null;
    let isWhitelisted = false;
    const currentHostname = window.location.hostname;

    // Get initial state and whitelist status
    Promise.all([
        new Promise(resolve => {
            chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
                if (response) {
                    enabled = response.enabled;
                    resolve();
                }
            });
        }),
        new Promise(resolve => {
            chrome.runtime.sendMessage({
                action: 'checkWhitelist',
                hostname: currentHostname
            }, (response) => {
                if (response) {
                    isWhitelisted = response.isWhitelisted;
                    resolve();
                }
            });
        })
    ]).then(() => {
        if (enabled && !isWhitelisted) {
            initializeBlocking();
        }
    });

    // Listen for state changes
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateState') {
            enabled = request.enabled;
            if (enabled && !isWhitelisted) {
                initializeBlocking();
            } else {
                removeBlocking();
            }
            sendResponse({ success: true });
        }

        if (request.action === 'updateWhitelist') {
            const whitelist = request.whitelist || [];
            const wasWhitelisted = isWhitelisted;
            isWhitelisted = whitelist.includes(currentHostname);

            // Send whitelist update to injected script
            window.postMessage({
                type: 'FULLSCREEN_BLOCKER_WHITELIST_UPDATE',
                isWhitelisted: isWhitelisted
            }, '*');

            // Update blocking based on new whitelist status
            if (enabled) {
                if (isWhitelisted && !wasWhitelisted) {
                    // Site was added to whitelist
                    removeBlocking();
                } else if (!isWhitelisted && wasWhitelisted) {
                    // Site was removed from whitelist
                    initializeBlocking();
                }
            }

            sendResponse({ success: true });
        }
    });

    function initializeBlocking() {
        // Don't block if site is whitelisted
        if (isWhitelisted) return;

        // Inject script to override fullscreen APIs early
        if (!injectedScript) {
            injectedScript = document.createElement('script');
            injectedScript.src = chrome.runtime.getURL('injected.js');
            injectedScript.onload = function () {
                this.remove();
                // Send initial state to injected script after it loads
                sendStateToInjectedScript();
            };
            (document.head || document.documentElement).appendChild(injectedScript);
        } else {
            // Script already injected, just update state
            sendStateToInjectedScript();
        }

        // Block F11 key
        document.addEventListener('keydown', handleKeyDown, true);

        // Block fullscreen events
        document.addEventListener('fullscreenchange', handleFullscreenChange, true);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange, true);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange, true);
        document.addEventListener('msfullscreenchange', handleFullscreenChange, true);

        // Block pointer lock (often used with fullscreen)
        document.addEventListener('pointerlockchange', handlePointerLockChange, true);

        console.log('Fullscreen blocking enabled for:', currentHostname);
    }

    function removeBlocking() {
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('fullscreenchange', handleFullscreenChange, true);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange, true);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange, true);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange, true);
        document.removeEventListener('pointerlockchange', handlePointerLockChange, true);

        // Send disable message to injected script
        window.postMessage({ type: 'FULLSCREEN_BLOCKER_DISABLE' }, '*');

        console.log('Fullscreen blocking disabled for:', currentHostname);
    }

    function sendStateToInjectedScript() {
        // Send current blocker state
        window.postMessage({
            type: enabled ? 'FULLSCREEN_BLOCKER_ENABLE' : 'FULLSCREEN_BLOCKER_DISABLE'
        }, '*');

        // Send whitelist status
        window.postMessage({
            type: 'FULLSCREEN_BLOCKER_WHITELIST_UPDATE',
            isWhitelisted: isWhitelisted
        }, '*');
    }

    function handleKeyDown(event) {
        if (!enabled || isWhitelisted) return;

        // Block F11 key
        if (event.key === 'F11' || event.keyCode === 122) {
            event.preventDefault();
            event.stopImmediatePropagation();
            chrome.runtime.sendMessage({ action: 'blocked' });
            console.log('F11 key blocked on:', currentHostname);
            return false;
        }
    }

    function handleFullscreenChange(event) {
        if (!enabled || isWhitelisted) return;

        // If somehow fullscreen was entered, immediately exit
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) {

            event.preventDefault();
            event.stopImmediatePropagation();

            // Force exit fullscreen
            setTimeout(() => {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => { });
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }, 0);

            chrome.runtime.sendMessage({ action: 'blocked' });
            console.log('Fullscreen attempt blocked on:', currentHostname);
            return false;
        }
    }

    function handlePointerLockChange(event) {
        if (!enabled || isWhitelisted) return;

        // Block pointer lock if used with fullscreen attempts
        if (document.pointerLockElement) {
            event.preventDefault();
            event.stopImmediatePropagation();
            document.exitPointerLock();
            console.log('Pointer lock blocked on:', currentHostname);
        }
    }

    // Listen for messages from injected script
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;

        if (event.data.type === 'FULLSCREEN_BLOCKED') {
            chrome.runtime.sendMessage({
                action: 'blocked',
                method: event.data.method || 'unknown',
                hostname: event.data.hostname || currentHostname
            });
            console.log('API fullscreen blocked on:', currentHostname, 'Method:', event.data.method);
        }
    });

    // Debug logging for whitelist status
    console.log(`Fullscreen Blocker Pro - Site: ${currentHostname}, Whitelisted: ${isWhitelisted}, Enabled: ${enabled}`);

})();