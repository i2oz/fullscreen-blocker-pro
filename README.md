# Fullscreen Blocker Pro

A professional Chrome extension that prevents websites from entering fullscreen mode automatically or via user interaction. Built by [Aytuğ Özgün](https://www.barlasay.com).

## 🌟 Features

- **🛡️ Complete Fullscreen Protection**: Blocks all types of fullscreen attempts including F11 key, API calls, and programmatic attempts
- **⌨️ F11 Key Blocking**: Prevents F11 key from triggering fullscreen mode
- **🌐 API Override Protection**: Overrides browser fullscreen APIs to prevent programmatic fullscreen
- **🔒 Auto-Fullscreen Prevention**: Stops websites from automatically entering fullscreen
- **🎯 Pointer Lock Blocking**: Prevents pointer lock that's often used with fullscreen
- **📝 Whitelist Support**: Add trusted sites that can use fullscreen when needed
- **🌍 Multi-language Support**: Available in 9 languages (English, Turkish, German, French, Spanish, Italian, Arabic, Russian, Chinese)
- **🌙 Smart Theming**: Automatic dark/light mode detection with manual override
- **📊 Usage Statistics**: Track blocked attempts and protected sessions
- **⚡ Real-time Toggle**: Instantly enable/disable protection with keyboard shortcut
- **🎨 Modern UI**: Clean, professional interface with smooth animations

## 🌍 Supported Languages

- 🇺🇸 English
- 🇹🇷 Türkçe (Turkish)
- 🇩🇪 Deutsch (German)
- 🇫🇷 Français (French)
- 🇪🇸 Español (Spanish)
- 🇮🇹 Italiano (Italian)
- 🇸🇦 العربية (Arabic)
- 🇷🇺 Русский (Russian)
- 🇨🇳 中文 (Chinese)

The extension automatically detects your browser language and displays the appropriate interface.

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store page](https://chromewebstore.google.com/detail/fullscreen-blocker-pro/febipmhaonfflclkijaehmhnacjilggf)
2. Click "Add to Chrome"
3. Confirm installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## 📖 Usage

### Basic Operation
- Click the extension icon to open the popup
- Use the toggle switch to enable/disable protection
- View statistics for blocked attempts and protected sessions

### Whitelist Management
- Click the "+" button to add current site to whitelist
- Whitelisted sites can use fullscreen normally
- Remove sites from whitelist by clicking the "×" button
- Current site status is shown with visual indicators

### Keyboard Shortcut
- Press `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac) to quickly toggle protection

### Theme Settings
- Click the theme toggle button in the popup header
- Cycles between Auto (system), Light, and Dark modes
- Theme preference is saved automatically and syncs across devices

## 🔧 Technical Details

### Files Structure
```
fullscreen-blocker-pro/
├── manifest.json              # Extension configuration with i18n support
├── background.js              # Service worker for background tasks
├── content.js                # Content script with whitelist support
├── injected.js               # Script injected into page context
├── popup.html                # Extension popup interface
├── popup.css                 # Popup styling with theme support
├── popup.js                  # Popup functionality with i18n
├── i18n.js                   # Internationalization handler
├── _locales/                 # Language files directory
│   ├── en/messages.json      # English
│   ├── tr/messages.json      # Turkish
│   ├── de/messages.json      # German
│   ├── fr/messages.json      # French
│   ├── es/messages.json      # Spanish
│   ├── it/messages.json      # Italian
│   ├── ar/messages.json      # Arabic
│   ├── ru/messages.json      # Russian
│   └── zh/messages.json      # Chinese
└── icons/                    # Extension icons (16, 32, 48, 128px)
```

### How It Works
1. **Content Script**: Monitors for fullscreen events, blocks F11 key, and manages whitelist
2. **Injected Script**: Overrides browser fullscreen APIs in page context
3. **Background Worker**: Manages extension state, whitelist, and coordinates between tabs
4. **Popup Interface**: Provides user controls, statistics, and whitelist management
5. **i18n System**: Automatically loads appropriate language based on browser locale

### Permissions
- `activeTab`: Access current tab for content script injection
- `storage`: Save user preferences, statistics, and whitelist
- `notifications`: Show optional blocking notifications
- `<all_urls>`: Apply protection to all websites

## 🛡️ Whitelist Feature

The whitelist allows you to add trusted websites that should be allowed to use fullscreen:

- **Gaming sites** (for legitimate fullscreen gaming)
- **Video platforms** (for fullscreen video playback)
- **Presentation tools** (for fullscreen presentations)
- **Educational content** (for fullscreen learning materials)

Sites in the whitelist bypass all fullscreen blocking while maintaining protection on other sites.

## 🌐 Browser Compatibility

- **Minimum Chrome Version**: 88+
- **Manifest Version**: 3 (modern Chrome extension standard)
- **Cross-browser**: Chrome, Chromium-based browsers (Edge, Brave, etc.)
- **RTL Support**: Full support for right-to-left languages (Arabic)

## 🔒 Privacy

This extension:
- ✅ Does NOT collect any personal data
- ✅ Does NOT track browsing history
- ✅ Does NOT send data to external servers
- ✅ Only stores preferences and whitelist locally in your browser
- ✅ Works completely offline
- ✅ Complies with Chrome Web Store privacy requirements

See our [Privacy Policy](PRIVACY.md) for details.

## 👨‍💻 Developer

**Aytuğ Özgün**
- 🌐 Website: [barlasay.com](https://www.barlasay.com)
- 📧 Email: [aytug@barlasay.com](mailto:aytug@barlasay.com)
- 🐙 GitHub: [@i2oz](https://github.com/i2oz)
- 🐦 Twitter: [@aytugozgun](https://x.com/aytugozgun)
- 💼 LinkedIn: [/in/i2oz](https://linkedin.com/in/i2oz)

## 🤝 Development

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/i2oz/fullscreen-blocker-pro.git
   ```
2. Make your changes
3. Test in Chrome with developer mode
4. Submit pull requests for improvements

### Building
No build process required - this is a vanilla JavaScript extension with i18n support.

### Adding New Languages
1. Create new folder in `_locales/` (e.g., `_locales/pt/`)
2. Copy `_locales/en/messages.json` to the new folder
3. Translate all message values
4. Test with Chrome language settings

## 📞 Support

- **Issues**: [Report bugs via GitHub Issues](https://github.com/i2oz/fullscreen-blocker-pro/issues)
- **Feature Requests**: [Submit via GitHub Issues](https://github.com/i2oz/fullscreen-blocker-pro/issues)
- **Email**: [aytug@barlasay.com](mailto:aytug@barlasay.com)
- **Website**: [barlasay.com](https://www.barlasay.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📈 Changelog

### Version 1.0.0
- Initial release
- Complete fullscreen blocking functionality
- Multi-language support (9 languages)
- Modern UI with light/dark/auto theme support
- Whitelist feature for trusted sites
- Usage statistics tracking
- Keyboard shortcut support (Ctrl+Shift+F)
- Chrome Web Store ready

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Translation Contributions
Help us add more languages! See the "Adding New Languages" section above.

## ⭐ Show Your Support

If you find this extension helpful:
- ⭐ Star this repository
- 🔄 Share with friends
- 📝 Rate on Chrome Web Store
- 🐛 Report bugs or suggest features

---

**Keep your browsing experience under control with Fullscreen Blocker Pro!**

*Made with ❤️ by [Aytuğ Özgün](https://www.barlasay.com)*
