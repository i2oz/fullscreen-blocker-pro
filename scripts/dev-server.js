#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');

/**
 * Simple development server for Chrome extension
 * Watches files and provides helpful development feedback
 */
class ExtensionDevServer {
    constructor() {
        this.watchedFiles = [
            'manifest.json',
            '*.js',
            '*.html',
            '*.css',
            '_locales/**/*.json'
        ];

        this.buildDir = path.join(process.cwd(), 'build');
        this.isWatching = false;
    }

    start() {
        console.log(chalk.blue('🚀 Starting Fullscreen Blocker Pro Development Server...\n'));

        // Initial validation
        this.validateProject();

        // Start watching files
        this.startWatching();

        // Show helpful info
        this.showDevInfo();
    }

    validateProject() {
        console.log(chalk.yellow('🔍 Validating project...'));

        const requiredFiles = [
            'manifest.json',
            'background.js',
            'content.js',
            'injected.js',
            'popup.html',
            'popup.css',
            'popup.js',
            'i18n.js'
        ];

        let allValid = true;

        for (const file of requiredFiles) {
            const filePath = path.join(process.cwd(), file);
            if (fs.existsSync(filePath)) {
                console.log(chalk.green(`  ✅ ${file}`));
            } else {
                console.log(chalk.red(`  ❌ ${file} - MISSING`));
                allValid = false;
            }
        }

        // Check i18n files
        const localesDir = path.join(process.cwd(), '_locales');
        if (fs.existsSync(localesDir)) {
            const locales = fs.readdirSync(localesDir);
            console.log(chalk.green(`  ✅ _locales/ (${locales.length} languages)`));
        } else {
            console.log(chalk.red('  ❌ _locales/ - MISSING'));
            allValid = false;
        }

        if (allValid) {
            console.log(chalk.green('\n✅ Project validation passed!\n'));
        } else {
            console.log(chalk.red('\n❌ Project validation failed. Please fix missing files.\n'));
        }
    }

    startWatching() {
        console.log(chalk.yellow('👀 Starting file watcher...'));

        const watcher = chokidar.watch(this.watchedFiles, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        });

        watcher
            .on('change', (filePath) => {
                console.log(chalk.blue(`📝 Changed: ${filePath}`));
                this.handleFileChange(filePath);
            })
            .on('add', (filePath) => {
                console.log(chalk.green(`➕ Added: ${filePath}`));
            })
            .on('unlink', (filePath) => {
                console.log(chalk.red(`🗑️  Removed: ${filePath}`));
            })
            .on('error', (error) => {
                console.log(chalk.red(`❌ Watcher error: ${error}`));
            });

        this.isWatching = true;
        console.log(chalk.green('✅ File watcher started\n'));
    }

    handleFileChange(filePath) {
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);

        // Validate specific file types
        if (fileName === 'manifest.json') {
            this.validateManifest();
        } else if (ext === '.json' && filePath.includes('_locales')) {
            this.validateI18nFile(filePath);
        } else if (ext === '.js') {
            this.validateJavaScript(filePath);
        }

        // Show reload suggestion
        console.log(chalk.dim('💡 Reload extension in Chrome to see changes\n'));
    }

    validateManifest() {
        try {
            const manifestPath = path.join(process.cwd(), 'manifest.json');
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

            if (manifest.manifest_version === 3) {
                console.log(chalk.green('  ✅ manifest.json is valid Manifest V3'));
            } else {
                console.log(chalk.red('  ❌ manifest.json should use Manifest V3'));
            }
        } catch (error) {
            console.log(chalk.red(`  ❌ manifest.json JSON error: ${error.message}`));
        }
    }

    validateI18nFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
            console.log(chalk.green(`  ✅ ${filePath} is valid JSON`));
        } catch (error) {
            console.log(chalk.red(`  ❌ ${filePath} JSON error: ${error.message}`));
        }
    }

    validateJavaScript(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Basic syntax check (very simple)
            if (content.includes('chrome.') && !content.includes('chrome.runtime')) {
                console.log(chalk.yellow(`  ⚠️  ${filePath} uses Chrome APIs - ensure proper context`));
            }

            console.log(chalk.green(`  ✅ ${filePath} loaded successfully`));
        } catch (error) {
            console.log(chalk.red(`  ❌ ${filePath} error: ${error.message}`));
        }
    }

    showDevInfo() {
        console.log(chalk.cyan('📋 Development Information:'));
        console.log(chalk.dim('   Chrome Extensions: chrome://extensions/'));
        console.log(chalk.dim('   Enable Developer mode → Load unpacked'));
        console.log(chalk.dim('   Reload extension after changes'));
        console.log(chalk.dim('   Background page console: chrome://extensions/ → Service Worker'));
        console.log(chalk.dim('   Popup debugging: Right-click extension → Inspect popup\n'));

        console.log(chalk.cyan('🛠️  Available Commands:'));
        console.log(chalk.dim('   npm test          - Run validation'));
        console.log(chalk.dim('   npm run build     - Build for production'));
        console.log(chalk.dim('   npm run lint      - Lint JavaScript'));
        console.log(chalk.dim('   Ctrl+C            - Stop dev server\n'));

        console.log(chalk.green('🎯 Development server is running...'));
        console.log(chalk.dim('   Watching for file changes...\n'));
    }

    stop() {
        console.log(chalk.yellow('\n👋 Stopping development server...'));
        process.exit(0);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Development server stopped.'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n👋 Development server terminated.'));
    process.exit(0);
});

// Start the dev server
if (require.main === module) {
    const server = new ExtensionDevServer();
    server.start();
}

module.exports = ExtensionDevServer;