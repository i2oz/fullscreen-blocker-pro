# Fullscreen Blocker Pro - Project Structure

This document outlines the complete project structure and setup for the Fullscreen Blocker Pro Chrome extension.

## 📁 Complete Directory Structure

```
fullscreen-blocker-pro/
├── 📄 manifest.json                 # Extension configuration (Manifest V3)
├── 🔧 background.js                 # Service worker for background tasks
├── 📜 content.js                   # Content script with whitelist support
├── ⚡ injected.js                  # Script injected into page context
├── 🎨 popup.html                   # Extension popup interface
├── 💅 popup.css                    # Popup styling with themes
├── ⚙️ popup.js                     # Popup functionality
├── 🌍 i18n.js                      # Internationalization handler
│
├── 📚 _locales/                    # Internationalization files
│   ├── en/messages.json            # English (base)
│   ├── tr/messages.json            # Turkish  
│   ├── de/messages.json            # German
│   ├── fr/messages.json            # French
│   ├── es/messages.json            # Spanish
│   ├── it/messages.json            # Italian
│   ├── ar/messages.json            # Arabic
│   ├── ru/messages.json            # Russian
│   └── zh/messages.json            # Chinese
│
├── 🖼️ icons/                       # Extension icons (create these)
│   ├── icon16.png                  # 16x16 icon
│   ├── icon32.png                  # 32x32 icon  
│   ├── icon48.png                  # 48x48 icon
│   ├── icon128.png                 # 128x128 icon
│   ├── icon16-disabled.png         # Disabled state icons
│   ├── icon32-disabled.png
│   ├── icon48-disabled.png
│   └── icon128-disabled.png
│
├── 🛠️ scripts/                     # Development scripts
│   ├── validate-manifest.js        # Manifest validation
│   ├── check-i18n.js              # i18n completeness check
│   └── build.js                   # Build script for Chrome Web Store
│
├── 🤖 .github/                     # GitHub configuration
│   ├── workflows/
│   │   └── ci.yml                  # Continuous integration
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md           # Bug report template
│       └── feature_request.md      # Feature request template
│
├── 📋 package.json                 # Node.js dependencies and scripts
├── 🎯 .eslintrc.js                 # ESLint configuration
├── 💅 .prettierrc                  # Prettier configuration
├── 📖 README.md                    # Main documentation
├── 📄 LICENSE                      # MIT License
├── 🔒 PRIVACY.md                   # Privacy policy
├── 🤝 CONTRIBUTING.md              # Contribution guidelines
└── 📊 STRUCTURE.md                 # This file
```

## 🚀 Quick Setup Guide

### 1. Clone and Setup
```bash
git clone https://github.com/i2oz/fullscreen-blocker-pro.git
cd fullscreen-blocker-pro
npm install
```

### 2. Development
```bash
# Validate everything
npm test

# Lint code
npm run lint

# Build for Chrome Web Store
npm run build
```

### 3. Load in Chrome
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project folder

## 🔧 Core Extension Files

### `manifest.json`
- **Purpose**: Extension configuration and permissions
- **Key Features**: Manifest V3, i18n support, proper permissions
- **Auto-validation**: ✅ Via `scripts/validate-manifest.js`

### `background.js`
- **Purpose**: Service worker for background tasks
- **Features**: State management, notifications, whitelist coordination
- **Communication**: Messages between tabs and popup

### `content.js`
- **Purpose**: Page-level fullscreen blocking
- **Features**: F11 blocking, whitelist checking, event handling
- **Injection**: Runs on all pages at document_start

### `injected.js`
- **Purpose**: Override browser APIs in page context
- **Features**: API overrides, CSP bypass protection
- **Security**: Sandboxed execution environment

### `popup.html/css/js`
- **Purpose**: User interface for extension controls
- **Features**: Theme support, whitelist management, statistics
- **Design**: Modern, responsive, accessible

### `i18n.js`
- **Purpose**: Internationalization support
- **Features**: Automatic locale detection, RTL support
- **Languages**: 9 languages supported

## 🌍 Internationalization System

### Supported Languages
| Code | Language | Status | RTL |
|------|----------|--------|-----|
| `en` | English | ✅ Complete | No |
| `tr` | Turkish | ✅ Complete | No |
| `de` | German | ✅ Complete | No |
| `fr` | French | ✅ Complete | No |
| `es` | Spanish | ✅ Complete | No |
| `it` | Italian | ✅ Complete | No |
| `ar` | Arabic | ✅ Complete | Yes |
| `ru` | Russian | ✅ Complete | No |
| `zh` | Chinese | ✅ Complete | No |

### Adding New Languages
1. Create `_locales/[code]/messages.json`
2. Copy and translate all keys from `_locales/en/messages.json`
3. Test with `npm run check-i18n`
4. Submit PR with translations

## 🎨 Theming System

### Theme Modes
- **Auto**: Follows system dark/light preference
- **Light**: Always light theme
- **Dark**: Always dark theme

### CSS Custom Properties
```css
:root {
  --bg-primary: #ffffff;     /* Background colors */
  --text-primary: #1e293b;   /* Text colors */
  --accent-primary: #3b82f6; /* Accent colors */
  /* ... more variables */
}
```

### Theme Implementation
- CSS custom properties for all colors
- Automatic system preference detection
- Smooth transitions between themes
- Persistent user preference storage

## 🛡️ Security Features

### Content Security Policy
- No unsafe-eval or unsafe-inline
- Strict script sources
- Manifest V3 compliance

### Privacy Protection
- No external data collection
- Local storage only
- No tracking or analytics
- GDPR/CCPA compliant

### Code Security
- ESLint security rules
- No eval() usage
- Input validation
- Sandboxed script injection

## 📊 Development Tools

### Quality Assurance
```bash
npm run lint          # Code linting
npm run lint:fix       # Auto-fix lint issues
npm run validate-manifest  # Validate manifest.json
npm run check-i18n     # Check translation completeness
```

### Building
```bash
npm run build         # Build for production
npm run package       # Create Chrome Web Store ZIP
```

### Testing
```bash
npm test             # Run all validation checks
```

## 🔄 CI/CD Pipeline

### GitHub Actions
- **Lint and Validate**: Code quality checks
- **Security Scan**: Security vulnerability detection
- **Extension Validation**: Manifest and structure validation
- **Build Test**: Ensure clean builds
- **i18n Check**: Translation completeness

### Quality Gates
- All checks must pass before merge
- Automated ZIP creation for releases
- Security scanning on every PR

## 📦 Chrome Web Store Preparation

### Required Files for Store
- ✅ `manifest.json` (validated)
- ✅ All referenced JavaScript files
- ✅ `popup.html` and assets
- ✅ `_locales/` with all translations
- ✅ `icons/` with all required sizes
- ✅ Privacy policy and documentation

### Store Assets Needed
- 📸 Screenshots (1280x800 or 640x400)
- 🎨 Store icon (128x128)
- 📝 Store description (multiple languages)
- 🔒 Privacy policy link

### Build Process
1. Run `npm run build`
2. Creates `dist/fullscreen-blocker-pro-v1.0.0.zip`
3. Upload ZIP to Chrome Web Store
4. Fill store listing information
5. Submit for review

## 🤝 Contributing Workflow

### For Developers
1. Fork repository
2. Create feature branch
3. Make changes and test
4. Run `npm test` to validate
5. Submit PR with description

### For Translators
1. Check `CONTRIBUTING.md` for language guidelines
2. Create/update `_locales/[code]/messages.json`
3. Test with browser language settings
4. Submit PR with new translations

### For Bug Reports
1. Use `.github/ISSUE_TEMPLATE/bug_report.md`
2. Include browser version and steps
3. Provide console errors if any

## 📋 Release Checklist

### Pre-Release
- [ ] All tests passing (`npm test`)
- [ ] Version bumped in `manifest.json`
- [ ] Changelog updated
- [ ] All translations complete
- [ ] Security audit clean

### Release Process
- [ ] Create release tag
- [ ] Build extension (`npm run build`)
- [ ] Upload to Chrome Web Store
- [ ] Update GitHub release
- [ ] Announce release

### Post-Release
- [ ] Monitor for issues
- [ ] Update documentation
- [ ] Plan next features

## 🔍 Troubleshooting

### Common Issues
- **Extension not loading**: Check manifest validation
- **i18n not working**: Verify locale files with `npm run check-i18n`
- **Build failing**: Run `npm test` to identify issues
- **Theme not switching**: Check CSS custom properties

### Debug Tools
- Chrome DevTools for popup debugging
- Background page inspection
- Console logging in content scripts
- Network tab for resource loading

---

**This structure ensures a professional, maintainable, and scalable Chrome extension ready for the Chrome Web Store! 🚀**

*For questions about the project structure, contact [Aytuğ Özgün](mailto:aytug@barlasay.com)*