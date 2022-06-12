import { fileURLToPath } from 'url';
import { dirname, normalize } from 'path';
import os from 'os';

/**
 * Given a file path, return the CJS equivalent of `__dirname`
 * @param {String} importMetaUrl - Should be `import.meta.url`
 * @returns {String}
 */

function getDirname(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
};

/**
 * Given a file or dir path, returns if it is allowed to access
 * (checks if it is in user's home directory)
 * @param {String} fullPath - Should be full path
 * @returns {Boolean}
 */
const checkPathIsAllowed = (fullPath) => {
    const homeDir = os.homedir();
    if (fullPath.startsWith(homeDir)) {
        return true
    } else {
        return false
    }
};


export {
    getDirname,
    checkPathIsAllowed
}


