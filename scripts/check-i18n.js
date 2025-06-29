#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates i18n files for completeness and consistency
 */
function checkI18n() {
    console.log('🌍 Checking i18n files...');

    const localesDir = path.join(process.cwd(), '_locales');

    // Check if _locales directory exists
    if (!fs.existsSync(localesDir)) {
        console.error('❌ Error: _locales directory not found');
        process.exit(1);
    }

    // Get all locale directories
    const locales = fs.readdirSync(localesDir).filter(item => {
        const itemPath = path.join(localesDir, item);
        return fs.statSync(itemPath).isDirectory();
    });

    if (locales.length === 0) {
        console.error('❌ Error: No locale directories found in _locales');
        process.exit(1);
    }

    // Check if English locale exists (required as base)
    if (!locales.includes('en')) {
        console.error('❌ Error: English locale (en) is required as the base locale');
        process.exit(1);
    }

    console.log(`📁 Found ${locales.length} locales: ${locales.join(', ')}`);

    // Load English messages as reference
    const enMessagesPath = path.join(localesDir, 'en', 'messages.json');
    if (!fs.existsSync(enMessagesPath)) {
        console.error('❌ Error: English messages.json not found');
        process.exit(1);
    }

    let enMessages;
    try {
        const enContent = fs.readFileSync(enMessagesPath, 'utf8');
        enMessages = JSON.parse(enContent);
    } catch (error) {
        console.error('❌ Error: Invalid JSON in English messages.json');
        console.error(error.message);
        process.exit(1);
    }

    const enKeys = Object.keys(enMessages).sort();
    console.log(`🔑 Base locale (en) has ${enKeys.length} keys`);

    let allValid = true;
    const stats = {};

    // Check each locale
    for (const locale of locales) {
        const messagesPath = path.join(localesDir, locale, 'messages.json');

        if (!fs.existsSync(messagesPath)) {
            console.error(`❌ Error: messages.json not found for locale '${locale}'`);
            allValid = false;
            continue;
        }

        let messages;
        try {
            const content = fs.readFileSync(messagesPath, 'utf8');
            messages = JSON.parse(content);
        } catch (error) {
            console.error(`❌ Error: Invalid JSON in ${locale}/messages.json`);
            console.error(error.message);
            allValid = false;
            continue;
        }

        const localeKeys = Object.keys(messages).sort();
        stats[locale] = {
            total: localeKeys.length,
            missing: [],
            extra: []
        };

        // Find missing keys
        for (const key of enKeys) {
            if (!messages[key]) {
                stats[locale].missing.push(key);
            }
        }

        // Find extra keys
        for (const key of localeKeys) {
            if (!enMessages[key]) {
                stats[locale].extra.push(key);
            }
        }

        // Validate message structure
        for (const [key, messageObj] of Object.entries(messages)) {
            if (typeof messageObj !== 'object' || !messageObj.message) {
                console.error(`❌ Error: Invalid message structure for key '${key}' in locale '${locale}'`);
                allValid = false;
            }

            // Check for empty messages
            if (!messageObj.message.trim()) {
                console.error(`❌ Error: Empty message for key '${key}' in locale '${locale}'`);
                allValid = false;
            }
        }

        // Report status for this locale
        if (stats[locale].missing.length === 0 && stats[locale].extra.length === 0) {
            console.log(`✅ ${locale}: Complete (${stats[locale].total} keys)`);
        } else {
            console.log(`⚠️  ${locale}: Issues found`);
            if (stats[locale].missing.length > 0) {
                console.log(`   Missing ${stats[locale].missing.length} keys: ${stats[locale].missing.slice(0, 5).join(', ')}${stats[locale].missing.length > 5 ? '...' : ''}`);
                allValid = false;
            }
            if (stats[locale].extra.length > 0) {
                console.log(`   Extra ${stats[locale].extra.length} keys: ${stats[locale].extra.slice(0, 5).join(', ')}${stats[locale].extra.length > 5 ? '...' : ''}`);
            }
        }
    }

    // Generate summary
    console.log('\n📊 Summary:');
    const completeLocales = Object.entries(stats).filter(([locale, stat]) =>
        stat.missing.length === 0 && stat.extra.length === 0
    ).map(([locale]) => locale);

    const incompleteLocales = Object.entries(stats).filter(([locale, stat]) =>
        stat.missing.length > 0
    ).map(([locale]) => locale);

    console.log(`✅ Complete locales (${completeLocales.length}): ${completeLocales.join(', ')}`);

    if (incompleteLocales.length > 0) {
        console.log(`❌ Incomplete locales (${incompleteLocales.length}): ${incompleteLocales.join(', ')}`);
    }

    // Check for common patterns
    console.log('\n🔍 Additional checks:');

    // Check for placeholder consistency
    const placeholderRegex = /\$\w+\$/g;
    for (const [key, messageObj] of Object.entries(enMessages)) {
        const enPlaceholders = (messageObj.message.match(placeholderRegex) || []).sort();

        if (enPlaceholders.length > 0) {
            for (const locale of locales) {
                if (locale === 'en') continue;

                const messagesPath = path.join(localesDir, locale, 'messages.json');
                if (fs.existsSync(messagesPath)) {
                    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
                    if (messages[key]) {
                        const localePlaceholders = (messages[key].message.match(placeholderRegex) || []).sort();
                        if (JSON.stringify(enPlaceholders) !== JSON.stringify(localePlaceholders)) {
                            console.log(`⚠️  Placeholder mismatch in '${key}' for locale '${locale}'`);
                        }
                    }
                }
            }
        }
    }

    if (allValid && incompleteLocales.length === 0) {
        console.log('\n✅ All i18n files are valid and complete!');
    } else {
        console.log('\n❌ i18n validation failed');
        process.exit(1);
    }
}

// Run check
if (require.main === module) {
    checkI18n();
}

module.exports = checkI18n;