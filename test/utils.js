import { execFileSync } from 'node:child_process';
import {
    existsSync,
    rmSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);
const CURRENT_FILE_DIR = path.dirname(CURRENT_FILE_PATH);
const ENTRY_PATH = path.join(CURRENT_FILE_DIR, '../index.js');
const ROOT_DIR = 'root';
const ENCODING = 'utf-8';

/**
 * @param {...string} args
 */
export const archive = (...args) =>
    execFileSync(process.execPath, [ENTRY_PATH, ...args], { stdio: 'inherit' });

/**
 * @param {string} root
 * @param {string} fileName
 * @param {string} fileExt
 * @param {string[]} [excludeList]
 */
export const findCopies = (root, fileName, fileExt, excludeList) =>
    readdirSync(root).filter(
        (filePath) =>
            !(excludeList && excludeList.includes(filePath)) &&
            filePath.startsWith(fileName) &&
            filePath.endsWith(fileExt) &&
            filePath !== fileName + fileExt,
    );

/**
 * @param {string} path
 * @param {string} content
 */
export const write = (path, content) =>
    writeFileSync(path, content, { encoding: ENCODING });

/**
 *
 * @param {string} path
 * @returns {string}
 */
export const read = (path) => readFileSync(path, { encoding: ENCODING });

/**
 * @param {number} ms
 */
export const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

/**
 * @param {string} dirName
 * @param {Record<string, string>} files
 */
export const initTest = (dirName, files) => {
    process.chdir(CURRENT_FILE_DIR);

    if (!existsSync(ROOT_DIR)) {
        mkdirSync(ROOT_DIR);
    }
    process.chdir(ROOT_DIR);

    if (existsSync(dirName)) {
        rmSync(dirName, { recursive: true });
    }
    mkdirSync(dirName);
    process.chdir(dirName);

    for (const [filePath, fileContent] of Object.entries(files)) {
        write(filePath, fileContent);
    }
};
