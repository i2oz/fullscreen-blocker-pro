// Internationalization handler for Fullscreen Blocker Pro
(function () {
    'use strict';

    // Initialize i18n when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeI18n);
    } else {
        initializeI18n();
    }

    function initializeI18n() {
        // Replace all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const messageKey = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(messageKey);
            if (message) {
                element.textContent = message;
            }
        });

        // Replace all elements with data-i18n-title attribute (for tooltips)
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const messageKey = element.getAttribute('data-i18n-title');
            const message = chrome.i18n.getMessage(messageKey);
            if (message) {
                element.title = message;
            }
        });

        // Replace all elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const messageKey = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(messageKey);
            if (message) {
                element.placeholder = message;
            }
        });

        // Set document title
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const messageKey = titleElement.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(messageKey);
            if (message) {
                document.title = message;
            }
        }

        // Set HTML lang attribute based on current locale
        const currentLocale = chrome.i18n.getUILanguage();
        document.documentElement.lang = currentLocale;

        console.log('i18n initialized for locale:', currentLocale);
    }

    // Utility function to get localized message
    window.getMessage = function (key, substitutions) {
        return chrome.i18n.getMessage(key, substitutions) || key;
    };

    // Utility function to get current locale
    window.getCurrentLocale = function () {
        return chrome.i18n.getUILanguage();
    };

    // Direction support for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const currentLang = chrome.i18n.getUILanguage().split('-')[0];

    if (rtlLanguages.includes(currentLang)) {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
    }

})();