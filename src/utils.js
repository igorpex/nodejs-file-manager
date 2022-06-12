import { fileURLToPath } from 'url';
import { dirname } from 'path';
/**
 * Given a file path, return the CJS equivalent of `__dirname`
 * @param {String} importMetaUrl - Should be `import.meta.url`
 * @returns {String}
 */
export function getDirname(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
};
