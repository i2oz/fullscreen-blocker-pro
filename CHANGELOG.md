# Changelog

All notable changes to Fullscreen Blocker Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-29

### 🎉 Initial Release

The first official release of Fullscreen Blocker Pro - a professional Chrome extension that prevents websites from entering fullscreen mode automatically or via user interaction.

### ✨ Added

#### Core Functionality
- **Complete Fullscreen Blocking**: Prevents all types of fullscreen attempts including F11 key, API calls, and programmatic attempts
- **F11 Key Blocking**: Intercepts and blocks F11 key press events
- **API Override Protection**: Overrides browser fullscreen APIs in page context to prevent programmatic fullscreen
- **Auto-Fullscreen Prevention**: Stops websites from automatically entering fullscreen mode
- **Pointer Lock Blocking**: Prevents pointer lock functionality often used with fullscreen

#### Whitelist System
- **Site Whitelist Management**: Add trusted websites that can use fullscreen when needed
- **Current Site Toggle**: Quick add/remove current site from whitelist
- **Visual Indicators**: Clear status indicators for whitelisted sites
- **Persistent Storage**: Whitelist syncs across browser sessions and devices

#### Multi-Language Support
- **9 Language Support**: English, Turkish, German, French, Spanish, Italian, Arabic, Russian, Chinese
- **Automatic Detection**: Automatically detects browser language and displays appropriate interface
- **RTL Support**: Full right-to-left language support for Arabic
- **Chrome i18n Integration**: Uses Chrome's built-in internationalization system

#### Modern User Interface
- **Smart Theming**: Auto/Light/Dark theme modes with system preference detection
- **Responsive Design**: Clean, professional interface optimized for all screen sizes
- **Smooth Animations**: Polished transitions and hover effects throughout the UI
- **Accessibility**: Full keyboard navigation and screen reader support

#### Statistics & Monitoring
- **Usage Statistics**: Track blocked attempts and protected browsing sessions
- **Real-time Counters**: Live updates of blocking activity
- **Session Tracking**: Monitor extension effectiveness over time
- **Visual Feedback**: Immediate feedback when fullscreen attempts are blocked

#### Developer Experience
- **Keyboard Shortcuts**: Ctrl+Shift+F (Cmd+Shift+F on Mac) to quickly toggle protection
- **Extension Badge**: Dynamic badge showing protection status
- **Background Notifications**: Optional notifications for blocked attempts
- **Console Logging**: Detailed logging for debugging and monitoring

### 🔧 Technical Features

#### Architecture
- **Manifest V3**: Built with the latest Chrome extension standards
- **Service Worker**: Efficient background processing with minimal resource usage
- **Content Script Injection**: Secure page-level blocking without compromising performance
- **Sandboxed Execution**: Safe script injection that respects page security policies

#### Security & Privacy
- **No Data Collection**: Zero personal data collection or external communications
- **Local Storage Only**: All preferences and statistics stored locally in browser
- **Minimal Permissions**: Only requests necessary permissions (activeTab, storage, notifications)
- **Open Source**: Full source code transparency for security auditing

#### Performance
- **Lightweight**: Minimal impact on page load times and browser performance
- **Efficient Blocking**: Optimized blocking algorithms with negligible overhead
- **Memory Optimized**: Smart memory management for long-term stability
- **Cross-Site Compatibility**: Works reliably across all website types

#### Quality Assurance
- **Comprehensive Testing**: Tested across major websites and use cases
- **Error Handling**: Robust error handling and graceful failure modes
- **Validation Suite**: Automated testing for code quality and functionality
- **Cross-Browser Ready**: Designed for Chrome and Chromium-based browsers

### 🌍 Supported Languages

| Language | Code | Status | Native Name |
|----------|------|--------|-------------|
| English | `en` | ✅ Complete | English |
| Turkish | `tr` | ✅ Complete | Türkçe |
| German | `de` | ✅ Complete | Deutsch |
| French | `fr` | ✅ Complete | Français |
| Spanish | `es` | ✅ Complete | Español |
| Italian | `it` | ✅ Complete | Italiano |
| Arabic | `ar` | ✅ Complete | العربية |
| Russian | `ru` | ✅ Complete | Русский |
| Chinese | `zh` | ✅ Complete | 中文 |

### 🛡️ Security

- **Content Security Policy**: Strict CSP implementation preventing code injection
- **Input Validation**: All user inputs properly validated and sanitized
- **Permission Minimization**: Only requests permissions essential for functionality
- **Secure Communication**: All inter-component communication uses Chrome's secure messaging APIs

### 📊 Compatibility

- **Minimum Chrome Version**: Chrome 88+ (covers 99%+ of active users)
- **Browser Support**: Chrome, Edge, Brave, Opera, and other Chromium-based browsers
- **Operating Systems**: Windows, macOS, Linux, ChromeOS
- **Architecture**: Universal compatibility (x64, ARM)

### 👨‍💻 Developer

**Aytuğ Özgün**
- 🌐 Website: [barlasay.com](https://www.barlasay.com)
- 📧 Email: [aytug@barlasay.com](mailto:aytug@barlasay.com)
- 🐙 GitHub: [@i2oz](https://github.com/i2oz)
- 🐦 Twitter: [@aytugozgun](https://x.com/aytugozgun)
- 💼 LinkedIn: [/in/i2oz](https://linkedin.com/in/i2oz)

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Download from [Chrome Web Store](https://chrome.google.com/webstore/detail/fullscreen-blocker-pro) | View on [GitHub](https://github.com/i2oz/fullscreen-blocker-pro)**

*Keep your browsing experience under control with Fullscreen Blocker Pro! 🛡️*