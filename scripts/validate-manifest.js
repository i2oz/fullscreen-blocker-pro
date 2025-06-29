#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates the Chrome extension manifest.json file
 */
function validateManifest() {
    console.log('🔍 Validating manifest.json...');

    const manifestPath = path.join(process.cwd(), 'manifest.json');

    // Check if manifest exists
    if (!fs.existsSync(manifestPath)) {
        console.error('❌ Error: manifest.json not found');
        process.exit(1);
    }

    let manifest;
    try {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        manifest = JSON.parse(manifestContent);
    } catch (error) {
        console.error('❌ Error: Invalid JSON in manifest.json');
        console.error(error.message);
        process.exit(1);
    }

    // Required fields for Manifest V3
    const requiredFields = [
        'manifest_version',
        'name',
        'version',
        'description'
    ];

    // Check required fields
    for (const field of requiredFields) {
        if (!manifest[field]) {
            console.error(`❌ Error: Required field '${field}' is missing from manifest.json`);
            process.exit(1);
        }
    }

    // Validate manifest version
    if (manifest.manifest_version !== 3) {
        console.error('❌ Error: This extension requires Manifest V3');
        process.exit(1);
    }

    // Validate version format
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(manifest.version)) {
        console.error('❌ Error: Version must be in format X.Y.Z (e.g., 1.0.0)');
        process.exit(1);
    }

    // Check for i18n usage
    if (manifest.name.startsWith('__MSG_') && !manifest.default_locale) {
        console.error('❌ Error: default_locale is required when using i18n in manifest');
        process.exit(1);
    }

    // Validate permissions
    if (manifest.permissions) {
        const validPermissions = [
            'activeTab',
            'storage',
            'notifications',
            'scripting',
            'tabs'
        ];

        for (const permission of manifest.permissions) {
            if (!validPermissions.includes(permission)) {
                console.warn(`⚠️  Warning: Permission '${permission}' may not be standard`);
            }
        }
    }

    // Check for required files
    const requiredFiles = [];

    if (manifest.background && manifest.background.service_worker) {
        requiredFiles.push(manifest.background.service_worker);
    }

    if (manifest.content_scripts) {
        manifest.content_scripts.forEach(script => {
            if (script.js) {
                requiredFiles.push(...script.js);
            }
        });
    }

    if (manifest.action && manifest.action.default_popup) {
        requiredFiles.push(manifest.action.default_popup);
    }

    if (manifest.web_accessible_resources) {
        manifest.web_accessible_resources.forEach(resource => {
            if (resource.resources) {
                requiredFiles.push(...resource.resources);
            }
        });
    }

    // Check if required files exist
    for (const file of requiredFiles) {
        const filePath = path.join(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Error: Required file '${file}' not found`);
            process.exit(1);
        }
    }

    // Check icons
    if (manifest.icons) {
        for (const [size, iconPath] of Object.entries(manifest.icons)) {
            const fullPath = path.join(process.cwd(), iconPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`❌ Error: Icon file '${iconPath}' not found`);
                process.exit(1);
            }
        }
    }

    // Validate CSP if present
    if (manifest.content_security_policy) {
        const csp = manifest.content_security_policy;
        if (typeof csp === 'object') {
            // Manifest V3 format
            if (csp.extension_pages && (csp.extension_pages.includes('unsafe-eval') || csp.extension_pages.includes('unsafe-inline'))) {
                console.error('❌ Error: CSP contains unsafe directives');
                process.exit(1);
            }
        }
    }

    console.log('✅ Manifest validation passed');
    console.log(`📦 Extension: ${manifest.name} v${manifest.version}`);
    console.log(`📝 Description: ${manifest.description}`);

    if (manifest.default_locale) {
        console.log(`🌍 Default locale: ${manifest.default_locale}`);
    }
}

// Run validation
if (require.main === module) {
    validateManifest();
}

module.exports = validateManifest;