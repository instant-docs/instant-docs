// @ts-check
import fs from "fs";
import path from "path";
import UglifyJS from "uglify-js"; // Sync JS minificatn
import CleanCSS from "clean-css"; // For CSS minificatn
import { minify } from "htmlfy";

const cleanCSS = new CleanCSS();

/**
 * Copy files/directories while minifying supported file types (synchronous)
 * @param {string} srcPath - Source path (file or directory)
 * @param {string} destPath - Destination path
 * @param {boolean} recursive - Whether to copy recursively
 */
export function copyAndMinify(srcPath, destPath, recursive = true) {
    try {
        const srcStats = fs.statSync(srcPath);

        if (srcStats.isFile()) {
            copyAndMinifyFile(srcPath, destPath);
        } else if (srcStats.isDirectory() && recursive) {
            copyAndMinifyDirectory(srcPath, destPath);
        } else if (srcStats.isDirectory() && !recursive) {
            // Just create the directory without copying contents
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
        }
    } catch (error) {
        console.error(`Error copying ${srcPath}:`, error.message);
        throw error;
    }
}

function copyAndMinifyFile(srcPath, destPath) {
    const ext = path.extname(srcPath).toLowerCase();
    const destDir = path.dirname(destPath);

    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const content = fs.readFileSync(srcPath, 'utf8');
    let processedContent = content;

    try {
        switch (ext) {
            case '.js':
            case '.mjs':
                const jsResult = UglifyJS.minify(content, {
                    compress: true,
                    mangle: true,
                    output: { comments: false }
                });
                if (!jsResult.error) {
                    processedContent = jsResult.code;
                }
                break;

            case '.css':
                const cssResult = cleanCSS.minify(content);
                if (!cssResult.errors.length) {
                    processedContent = cssResult.styles;
                }
                break;

            case '.html':
            case '.htm':
            case '.xml':
            case '.htmx':
            case '.xhtml':
                processedContent = minify(content, false);
                break;

            case '.json':
                try {
                    const parsed = JSON.parse(content);
                    processedContent = JSON.stringify(parsed);
                } catch (e) {
                    // If JSON parsing fails, keep original content
                    processedContent = content;
                }
                break;

            default:
                // For non-minifiable files, just copy as-is
                processedContent = content;
        }
    } catch (minifyError) {
        console.warn(`Failed to minify ${srcPath}, copying original:`, minifyError.message);
        processedContent = content;
    }

    fs.writeFileSync(destPath, processedContent);
}

function copyAndMinifyDirectory(srcDir, destDir) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir);

    for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stats = fs.statSync(srcPath);

        if (stats.isFile()) {
            copyAndMinifyFile(srcPath, destPath);
        } else if (stats.isDirectory()) {
            copyAndMinifyDirectory(srcPath, destPath);
        }
    }
}