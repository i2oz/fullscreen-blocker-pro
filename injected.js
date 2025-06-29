(function () {
    'use strict';

    let blockerEnabled = true;
    let isWhitelisted = false;
    const currentHostname = window.location.hostname;

    // Enhanced logging for debugging
    const log = (message, type = 'info') => {
        if (typeof console !== 'undefined') {
            console[type](`[Fullscreen Blocker Pro] ${message}`);
        }
    };

    log(`Initializing on ${currentHostname}`);

    // Listen for enable/disable and whitelist messages
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;

        switch (event.data.type) {
            case 'FULLSCREEN_BLOCKER_ENABLE':
                blockerEnabled = true;
                log('Blocker enabled');
                break;

            case 'FULLSCREEN_BLOCKER_DISABLE':
                blockerEnabled = false;
                log('Blocker disabled');
                break;

            case 'FULLSCREEN_BLOCKER_WHITELIST_UPDATE':
                isWhitelisted = event.data.isWhitelisted || false;
                log(`Whitelist status: ${isWhitelisted ? 'whitelisted' : 'not whitelisted'}`);
                break;
        }
    });

    // Check if blocking should occur
    function shouldBlock() {
        return blockerEnabled && !isWhitelisted;
    }

    // Enhanced blocked method creator with better error messages
    function createBlockedMethod(originalMethod, methodName) {
        return function (...args) {
            if (shouldBlock()) {
                log(`Blocked ${methodName} attempt`, 'warn');
                window.postMessage({
                    type: 'FULLSCREEN_BLOCKED',
                    method: methodName,
                    hostname: currentHostname
                }, '*');

                return Promise.reject(new DOMException(
                    `Fullscreen blocked by Fullscreen Blocker Pro. Add ${currentHostname} to whitelist if needed.`,
                    'NotAllowedError'
                ));
            }
            log(`Allowing ${methodName} (whitelisted: ${isWhitelisted})`, 'info');
            return originalMethod.apply(this, args);
        };
    }

    // Store original methods for potential restoration
    const originalMethods = {};

    // Override Element.requestFullscreen
    if (Element.prototype.requestFullscreen) {
        originalMethods.requestFullscreen = Element.prototype.requestFullscreen;
        Element.prototype.requestFullscreen = createBlockedMethod(
            originalMethods.requestFullscreen,
            'requestFullscreen'
        );
    }

    // Override webkit variant
    if (Element.prototype.webkitRequestFullscreen) {
        originalMethods.webkitRequestFullscreen = Element.prototype.webkitRequestFullscreen;
        Element.prototype.webkitRequestFullscreen = createBlockedMethod(
            originalMethods.webkitRequestFullscreen,
            'webkitRequestFullscreen'
        );
    }

    // Override moz variant
    if (Element.prototype.mozRequestFullScreen) {
        originalMethods.mozRequestFullScreen = Element.prototype.mozRequestFullScreen;
        Element.prototype.mozRequestFullScreen = createBlockedMethod(
            originalMethods.mozRequestFullScreen,
            'mozRequestFullScreen'
        );
    }

    // Override ms variant
    if (Element.prototype.msRequestFullscreen) {
        originalMethods.msRequestFullscreen = Element.prototype.msRequestFullscreen;
        Element.prototype.msRequestFullscreen = createBlockedMethod(
            originalMethods.msRequestFullscreen,
            'msRequestFullscreen'
        );
    }

    // Block programmatic fullscreen property attempts
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function (obj, prop, descriptor) {
        if (shouldBlock() &&
            (prop === 'fullscreen' ||
                prop === 'webkitFullscreen' ||
                prop === 'mozFullScreen' ||
                prop === 'msFullscreen') &&
            descriptor && descriptor.value === true) {

            log(`Blocked Object.defineProperty fullscreen attempt on ${prop}`, 'warn');
            window.postMessage({
                type: 'FULLSCREEN_BLOCKED',
                method: 'defineProperty',
                property: prop,
                hostname: currentHostname
            }, '*');
            return obj;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };

    // Enhanced screen orientation lock blocking
    if (screen?.orientation?.lock) {
        const originalLock = screen.orientation.lock;
        screen.orientation.lock = function (...args) {
            if (shouldBlock() && args[0]) {
                const orientation = args[0];
                // Block landscape orientation locks often used with fullscreen
                if (typeof orientation === 'string' &&
                    (orientation.includes('landscape') ||
                        orientation.includes('portrait-primary'))) {

                    log(`Blocked screen orientation lock: ${orientation}`, 'warn');
                    window.postMessage({
                        type: 'FULLSCREEN_BLOCKED',
                        method: 'orientationLock',
                        orientation: orientation,
                        hostname: currentHostname
                    }, '*');

                    return Promise.reject(new DOMException(
                        'Orientation lock blocked by Fullscreen Blocker Pro',
                        'NotSupportedError'
                    ));
                }
            }
            return originalLock.apply(this, args);
        };
    }

    // Enhanced CSS fullscreen detection and blocking
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (property, value, priority) {
        if (shouldBlock()) {
            // Detect potential CSS-based fullscreen attempts
            const isFullscreenCSS = (
                property === 'position' && value === 'fixed' &&
                (this.getPropertyValue('top') === '0px' || this.top === '0px') &&
                (this.getPropertyValue('left') === '0px' || this.left === '0px') &&
                (this.getPropertyValue('width') === '100vw' || this.width === '100vw') &&
                (this.getPropertyValue('height') === '100vh' || this.height === '100vh')
            ) || (
                    property === 'z-index' && parseInt(value) > 999999
                );

            if (isFullscreenCSS) {
                log(`Blocked CSS fullscreen attempt: ${property}=${value}`, 'warn');
                window.postMessage({
                    type: 'FULLSCREEN_BLOCKED',
                    method: 'cssFullscreen',
                    property: property,
                    value: value,
                    hostname: currentHostname
                }, '*');
                return;
            }
        }
        return originalSetProperty.call(this, property, value, priority);
    };

    // Enhanced iframe attribute monitoring
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (shouldBlock() && this.tagName === 'IFRAME') {
            if (name === 'allowfullscreen' || name === 'webkitallowfullscreen' || name === 'mozallowfullscreen') {
                log(`Blocked iframe ${name} attribute`, 'warn');
                window.postMessage({
                    type: 'FULLSCREEN_BLOCKED',
                    method: 'iframeAttribute',
                    attribute: name,
                    hostname: currentHostname
                }, '*');
                return;
            }
        }
        return originalSetAttribute.call(this, name, value);
    };

    // Block keyboard event simulation (advanced)
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
        if (shouldBlock() && event instanceof KeyboardEvent) {
            // Block simulated F11 key events
            if (event.key === 'F11' || event.keyCode === 122 || event.which === 122) {
                log('Blocked simulated F11 key event', 'warn');
                window.postMessage({
                    type: 'FULLSCREEN_BLOCKED',
                    method: 'simulatedF11',
                    hostname: currentHostname
                }, '*');
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            }
        }
        return originalDispatchEvent.call(this, event);
    };

    // Monitor for fullscreen API usage attempts
    const monitorFullscreenAPI = () => {
        const properties = [
            'fullscreenElement',
            'webkitFullscreenElement',
            'mozFullScreenElement',
            'msFullscreenElement'
        ];

        properties.forEach(prop => {
            if (document[prop] !== undefined) {
                Object.defineProperty(document, prop, {
                    get: function () {
                        if (shouldBlock()) {
                            log(`Blocked access to ${prop}`, 'warn');
                            return null;
                        }
                        return originalDefineProperty.call(this);
                    },
                    configurable: true
                });
            }
        });
    };

    // Initialize API monitoring
    try {
        monitorFullscreenAPI();
    } catch (error) {
        log(`Error setting up fullscreen API monitoring: ${error.message}`, 'error');
    }

    // Enhanced video element monitoring
    const monitorVideoElements = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'VIDEO') {
                        // Override video fullscreen methods
                        if (node.requestFullscreen && shouldBlock()) {
                            node.requestFullscreen = createBlockedMethod(
                                node.requestFullscreen.bind(node),
                                'video-requestFullscreen'
                            );
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Initialize video monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorVideoElements);
    } else {
        monitorVideoElements();
    }

    // Cleanup function (not typically called, but good practice)
    window.fullscreenBlockerCleanup = () => {
        // Restore original methods if needed
        Object.keys(originalMethods).forEach(method => {
            if (Element.prototype[method]) {
                Element.prototype[method] = originalMethods[method];
            }
        });

        log('Cleanup completed');
    };

    log('Injection completed successfully');

})();