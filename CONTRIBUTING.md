# Contributing to Fullscreen Blocker Pro

Thank you for your interest in contributing to Fullscreen Blocker Pro! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic knowledge of JavaScript, HTML, and CSS
- Understanding of Chrome Extensions Manifest V3

### Development Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/fullscreen-blocker-pro.git
   cd fullscreen-blocker-pro
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the project directory
   - The extension will be loaded for testing

3. **Make your changes**
   - Edit the relevant files
   - Test your changes in the browser
   - Ensure functionality works across different websites

## 📝 Ways to Contribute

### 🐛 Bug Reports
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include browser version, OS, and steps to reproduce
- Provide screenshots or console errors if applicable

### ✨ Feature Requests
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Describe the feature and its use case
- Explain why it would be valuable for users

### 🌍 Translations
We welcome translations for additional languages!

#### Adding a New Language
1. Create a new folder in `_locales/` using the language code (e.g., `pt` for Portuguese)
2. Copy `_locales/en/messages.json` to your new folder
3. Translate all message values (keep the keys unchanged)
4. Test the translation by changing your browser language
5. Submit a pull request

#### Current Languages
- 🇺🇸 English (`en`)
- 🇹🇷 Turkish (`tr`)
- 🇩🇪 German (`de`)
- 🇫🇷 French (`fr`)
- 🇪🇸 Spanish (`es`)
- 🇮🇹 Italian (`it`)
- 🇸🇦 Arabic (`ar`)
- 🇷🇺 Russian (`ru`)
- 🇨🇳 Chinese (`zh`)

### 🔧 Code Contributions

#### Code Style Guidelines
- Use camelCase for variables and functions
- Use descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Use semicolons and consistent indentation

#### File Structure
```
src/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Content script
├── injected.js           # Page context script
├── popup.html            # Popup interface
├── popup.css             # Styling
├── popup.js              # Popup logic
├── i18n.js               # Internationalization
└── _locales/             # Language files
    ├── en/messages.json
    ├── tr/messages.json
    └── ...
```

#### Testing Your Changes
1. **Manual Testing**
   - Test on various websites (YouTube, gaming sites, news sites)
   - Test fullscreen blocking functionality
   - Test whitelist feature
   - Test theme switching
   - Test in different languages

2. **Edge Cases**
   - Test with ad blockers enabled
   - Test with other extensions
   - Test on mobile-responsive sites
   - Test keyboard shortcuts

## 📋 Pull Request Process

### Before Submitting
- [ ] Code follows the style guidelines
- [ ] All functionality has been tested
- [ ] No console errors or warnings
- [ ] Documentation is updated if needed
- [ ] Commit messages are descriptive

### PR Guidelines
1. **Create a descriptive title**
   - ✅ "Add Portuguese translation support"
   - ✅ "Fix whitelist not saving on popup close"
   - ❌ "Update files"

2. **Write a clear description**
   - Explain what changes were made and why
   - Reference any related issues (#123)
   - Include screenshots for UI changes

3. **Keep PRs focused**
   - One feature or fix per PR
   - Avoid mixing different types of changes

### Review Process
1. All PRs require review from the maintainer
2. Automated checks must pass
3. Manual testing will be performed
4. Feedback will be provided if changes are needed

## 🏗️ Development Guidelines

### Extension Architecture
- **Background Script**: Manages extension state, notifications, and inter-tab communication
- **Content Script**: Handles page-level blocking and whitelist checking
- **Injected Script**: Overrides browser APIs in page context
- **Popup**: User interface for controls and settings

### Key Features to Maintain
- **Performance**: Extension should have minimal impact on page load
- **Compatibility**: Must work across different websites and scenarios
- **Privacy**: No data collection or external communications
- **Accessibility**: UI should be accessible to all users

### Browser Support
- Chrome 88+
- Chromium-based browsers (Edge, Brave, Opera)
- Manifest V3 compliance

## 🚨 Security Considerations

- Never introduce external dependencies
- Avoid eval() or innerHTML with untrusted content
- Validate all user inputs
- Follow Chrome extension security best practices
- Report security issues privately to aytug@barlasay.com

## 📞 Getting Help

- **General Questions**: [Open a discussion](https://github.com/i2oz/fullscreen-blocker-pro/discussions)
- **Bug Reports**: [Create an issue](https://github.com/i2oz/fullscreen-blocker-pro/issues)
- **Direct Contact**: aytug@barlasay.com

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other contributors

### Enforcement
Instances of unacceptable behavior may be reported to aytug@barlasay.com.

## 🎉 Recognition

Contributors will be recognized in the following ways:
- Listed in the README contributors section
- Mentioned in release notes for significant contributions
- Special thanks for translation contributions

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/devguide/)
- [Internationalization Guide](https://developer.chrome.com/docs/extensions/reference/i18n/)

---

Thank you for contributing to Fullscreen Blocker Pro! 🙏

*For questions about contributing, contact [Aytuğ Özgün](mailto:aytug@barlasay.com)*