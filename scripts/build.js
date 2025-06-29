#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Builds the extension for Chrome Web Store submission
 */
async function buildExtension() {
    console.log('🔨 Building Fullscreen Blocker Pro for Chrome Web Store...');
    
    const buildDir = path.join(process.cwd(), 'build');
    const distDir = path.join(process.cwd(), 'dist');
    
    // Clean and create build directories
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
    }
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    
    fs.mkdirSync(buildDir, { recursive: true });
    fs.mkdirSync(distDir, { recursive: true });
    
    // Files to include in the extension
    const filesToCopy = [
        'manifest.json',
        'background.js',
        'content.js',
        'injected.js',
        'popup.html',
        'popup.css',
        'popup.js',
        'i18n.js'
    ];
    
    // Directories to copy
    const dirsToCopy = [
        '_locales'
    ];
    
    // Optional files/directories
    const optionalItems = [
        'icons',
        'README.md',
        'LICENSE',
        'PRIVACY.md'
    ];
    
    console.log('📁 Copying files to build directory...');
    
    // Copy required files
    for (const file of filesToCopy) {
        const srcPath = path.join(process.cwd(), file);
        const destPath = path.join(buildDir, file);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`✅ Copied: ${file}`);
        } else {
            console.error(`❌ Required file missing: ${file}`);
            process.exit(1);
        }
    }
    
    // Copy required directories
    for (const dir of dirsToCopy) {
        const srcPath = path.join(process.cwd(), dir);
        const destPath = path.join(buildDir, dir);
        
        if (fs.existsSync(srcPath)) {
            copyDirectory(srcPath, destPath);
            console.log(`✅ Copied directory: ${dir}`);
        } else {
            console.error(`❌ Required directory missing: ${dir}`);
            process.exit(1);
        }
    }
    
    // Copy optional items
    for (const item of optionalItems) {
        const srcPath = path.join(process.cwd(), item);
        const destPath = path.join(buildDir, item);
        
        if (fs.existsSync(srcPath)) {
            const stats = fs.statSync(srcPath);
            if (stats.isDirectory()) {
                copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
            console.log(`✅ Copied optional: ${item}`);
        } else {
            console.log(`⚠️  Optional item not found: ${item}`);
        }
    }
    
    // Validate the build
    console.log('\n🔍 Validating build...');
    
    const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, 'manifest.json'), 'utf8'));
    console.log(`📦 Extension: ${manifest.name} v${manifest.version}`);
    
    // Check if all referenced files exist in build
    const referencedFiles = [];
    
    if (manifest.background && manifest.background.service_worker) {
        referencedFiles.push(manifest.background.service_worker);
    }
    
    if (manifest.content_scripts) {
        manifest.content_scripts.forEach(script => {
            if (script.js) referencedFiles.push(...script.js);
            if (script.css) referencedFiles.push(...script.css);
        });
    }
    
    if (manifest.action && manifest.action.default_popup) {
        referencedFiles.push(manifest.action.default_popup);
    }
    
    if (manifest.web_accessible_resources) {
        manifest.web_accessible_resources.forEach(resource => {
            if (resource.resources) {
                referencedFiles.push(...resource.resources);
            }
        });
    }
    
    for (const file of referencedFiles) {
        const filePath = path.join(buildDir, file);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Referenced file missing in build: ${file}`);
            process.exit(1);
        }
    }
    
    console.log('✅ Build validation passed');
    
    // Create ZIP file for Chrome Web Store
    console.log('\n📦 Creating Chrome Web Store package...');
    
    const zipPath = path.join(distDir, `fullscreen-blocker-pro-v${manifest.version}.zip`);
    
    await createZip(buildDir, zipPath);
    
    // Get file size
    const stats = fs.statSync(zipPath);
    const sizeKB = Math.round(stats.size / 1024);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Package created: ${path.basename(zipPath)}`);
    console.log(`📏 Package size: ${sizeKB} KB (${sizeMB} MB)`);
    
    // Check size limits
    if (stats.size > 128 * 1024 * 1024) { // 128 MB limit
        console.warn('⚠️  Warning: Package size exceeds Chrome Web Store limit (128 MB)');
    } else if (stats.size > 50 * 1024 * 1024) { // 50 MB warning
        console.warn('⚠️  Warning: Large package size, consider optimization');
    }
    
    // Generate summary
    console.log('\n📋 Build Summary:');
    console.log(`   Extension: ${manifest.name}`);
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Package: ${zipPath}`);
    console.log(`   Size: ${sizeKB} KB`);
    
    const buildFiles = getAllFiles(buildDir);
    console.log(`   Files: ${buildFiles.length}`);
    
    // Check for common issues
    console.log('\n🔍 Final checks:');
    
    // Check for development files
    const devFiles = buildFiles.filter(file => 
        file.includes('node_modules') ||
        file.includes('.git') ||
        file.endsWith('.log') ||
        file.endsWith('.tmp')
    );
    
    if (devFiles.length > 0) {
        console.warn(`⚠️  Development files found in build: ${devFiles.length}`);
    }
    
    // Check for large files
    const largeFiles = buildFiles.filter(file => {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        return stats.size > 1024 * 1024; // 1 MB
    });
    
    if (largeFiles.length > 0) {
        console.warn(`⚠️  Large files found: ${largeFiles.join(', ')}`);
    }
    
    console.log('✅ Build completed successfully!');
    console.log('\n🚀 Ready for Chrome Web Store submission!');
    console.log(`   Upload file: ${zipPath}`);
}

/**
 * Copy a directory recursively
 */
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Create a ZIP file from a directory
 */
function createZip(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', () => {
            resolve();
        });
        
        archive.on('error', (err) => {
            reject(err);
        });
        
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir, files = []) {
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            getAllFiles(fullPath, files);
        } else {
            files.push(path.relative(dir, fullPath));
        }
    }
    
    return files;
}

// Run build
if (require.main === module) {
    buildExtension().catch(error => {
        console.error('❌ Build failed:', error);
        process.exit(1);
    });
}

module.exports = buildExtension;