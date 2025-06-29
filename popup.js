// Enhanced Popup JavaScript for Fullscreen Blocker Pro with i18n and Whitelist support
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('status-text');
    const container = document.querySelector('.container');
    const sessionsElement = document.getElementById('sessionsProtected');
    const attemptsElement = document.getElementById('attemptsBlocked');
    const themeToggle = document.getElementById('themeToggle');
    const addWhitelistBtn = document.getElementById('addWhitelistBtn');
    const toggleCurrentSiteBtn = document.getElementById('toggleCurrentSite');
    const currentSiteUrl = document.getElementById('currentSiteUrl');
    const whitelistItems = document.getElementById('whitelistItems');

    // Theme management
    let currentTheme = 'auto';
    let currentSite = '';

    // Load initial states
    loadState();
    /* loadStats();  ?? SOR */
    loadTheme();
    loadCurrentSite();
    loadWhitelist();

    // Event listeners
    toggleSwitch.addEventListener('change', function () {
        const enabled = this.checked;
        updateState(enabled);
    });

    themeToggle.addEventListener('click', function () {
        cycleTheme();
    });

    addWhitelistBtn.addEventListener('click', function () {
        addToWhitelist(currentSite);
    });

    toggleCurrentSiteBtn.addEventListener('click', function () {
        toggleSiteProtection(currentSite);
    });

    // Credit links
    document.getElementById('supportLink').addEventListener('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'mailto:aytug@barlasay.com' });
    });

    document.getElementById('rateLink').addEventListener('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/fullscreen-blocker-pro' });
    });

    document.getElementById('privacyLink').addEventListener('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://raw.githubusercontent.com/i2oz/fullscreen-blocker-pro/refs/heads/main/PRIVACY.md' });
    });

    function loadState() {
        chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
            if (response) {
                const enabled = response.enabled;
                toggleSwitch.checked = enabled;
                updateUI(enabled);
            }
        });
    }

    function updateState(enabled) {
        chrome.runtime.sendMessage({
            action: 'setState',
            enabled: enabled
        }, (response) => {
            if (response && response.success) {
                updateUI(enabled);
                saveStats(enabled);
            }
        });
    }

    function updateUI(enabled) {
        if (enabled) {
            statusText.textContent = getMessage('protectionActive');
            container.classList.remove('disabled');
        } else {
            statusText.textContent = getMessage('protectionInactive');
            container.classList.add('disabled');
        }
    }

    function loadStats() {
        chrome.storage.sync.get(['sessionsProtected', 'attemptsBlocked'], (result) => {
            const sessions = result.sessionsProtected || 1;
            const attempts = result.attemptsBlocked || 0;

            animateValueChange(sessionsElement, sessions);
            animateValueChange(attemptsElement, attempts);
        });
    }

    function saveStats(enabled) {
        if (enabled) {
            chrome.storage.sync.get(['sessionsProtected'], (result) => {
                const sessions = (result.sessionsProtected || 0) + 1;
                chrome.storage.sync.set({ sessionsProtected: sessions });

                animateValueChange(sessionsElement, sessions);
            });
        }
    }

    function animateValueChange(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue !== newValue) {
            element.classList.add('updated');
            setTimeout(() => {
                element.textContent = newValue;
            }, 100);
            setTimeout(() => {
                element.classList.remove('updated');
            }, 600);
        }
    }

    function loadTheme() {
        chrome.storage.sync.get(['theme'], (result) => {
            currentTheme = result.theme || 'auto';
            applyTheme(currentTheme);
        });
    }

    function cycleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        currentTheme = themes[nextIndex];

        chrome.storage.sync.set({ theme: currentTheme });
        applyTheme(currentTheme);
    }

    function applyTheme(theme) {
        container.setAttribute('data-theme', theme);

        // Update theme toggle tooltip
        const tooltips = {
            'auto': getMessage('switchToLight') || 'Switch to light mode',
            'light': getMessage('switchToDark') || 'Switch to dark mode',
            'dark': getMessage('switchToAuto') || 'Switch to auto mode'
        };
        themeToggle.title = tooltips[theme];
    }

    function loadCurrentSite() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const url = new URL(tabs[0].url);
                currentSite = url.hostname;
                currentSiteUrl.textContent = currentSite;

                // Check if current site is in whitelist
                chrome.storage.sync.get(['whitelist'], (result) => {
                    const whitelist = result.whitelist || [];
                    const isWhitelisted = whitelist.includes(currentSite);
                    updateCurrentSiteButton(isWhitelisted);
                });
            }
        });
    }

    function updateCurrentSiteButton(isWhitelisted) {
        if (isWhitelisted) {
            toggleCurrentSiteBtn.classList.add('active');
            toggleCurrentSiteBtn.title = getMessage('removeFromWhitelist');
        } else {
            toggleCurrentSiteBtn.classList.remove('active');
            toggleCurrentSiteBtn.title = getMessage('addCurrentSite');
        }
    }

    function addToWhitelist(site) {
        if (!site) return;

        chrome.storage.sync.get(['whitelist'], (result) => {
            const whitelist = result.whitelist || [];
            if (!whitelist.includes(site)) {
                whitelist.push(site);
                chrome.storage.sync.set({ whitelist: whitelist }, () => {
                    loadWhitelist();
                    updateCurrentSiteButton(true);

                    // Notify content script
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                action: 'updateWhitelist',
                                whitelist: whitelist
                            });
                        }
                    });
                });
            }
        });
    }

    function removeFromWhitelist(site) {
        chrome.storage.sync.get(['whitelist'], (result) => {
            const whitelist = result.whitelist || [];
            const index = whitelist.indexOf(site);
            if (index > -1) {
                whitelist.splice(index, 1);
                chrome.storage.sync.set({ whitelist: whitelist }, () => {
                    loadWhitelist();
                    if (site === currentSite) {
                        updateCurrentSiteButton(false);
                    }

                    // Notify content script
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                action: 'updateWhitelist',
                                whitelist: whitelist
                            });
                        }
                    });
                });
            }
        });
    }

    function toggleSiteProtection(site) {
        chrome.storage.sync.get(['whitelist'], (result) => {
            const whitelist = result.whitelist || [];
            const index = whitelist.indexOf(site);

            if (index > -1) {
                removeFromWhitelist(site);
            } else {
                addToWhitelist(site);
            }
        });
    }

    function loadWhitelist() {
        chrome.storage.sync.get(['whitelist'], (result) => {
            const whitelist = result.whitelist || [];
            whitelistItems.innerHTML = '';

            whitelist.forEach(site => {
                const item = createWhitelistItem(site);
                whitelistItems.appendChild(item);
            });
        });
    }

    function createWhitelistItem(site) {
        const item = document.createElement('div');
        item.className = 'whitelist-item';

        item.innerHTML = `
            <span class="site-name">${site}</span>
            <button class="btn-remove" data-site="${site}" title="${getMessage('removeFromWhitelist')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        const removeBtn = item.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            removeFromWhitelist(site);
        });

        return item;
    }

    // Listen for blocked attempts with enhanced feedback
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'blocked') {
            chrome.storage.sync.get(['attemptsBlocked'], (result) => {
                const attempts = (result.attemptsBlocked || 0) + 1;
                chrome.storage.sync.set({ attemptsBlocked: attempts });

                animateValueChange(attemptsElement, attempts);

                // Show brief visual feedback
                showBlockedFeedback();
            });
        }
    });

    function showBlockedFeedback() {
        const originalBg = container.style.background;
        container.style.background = 'rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
            container.style.background = originalBg;
        }, 200);
    }

    // Auto-refresh stats
    const statsInterval = setInterval(loadStats, 5000);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        clearInterval(statsInterval);
    });

    // Initialize smooth animations
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});