#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { copyFile, stat } from 'node:fs/promises';

// TODO: overwrite control

const WARNING_LABEL = chalk.yellow('[WARNING]');
const ERROR_LABEL = chalk.red('[ERROR]');
const INFO_LABEL = chalk.blueBright('[INFO]');

const secondaryText = chalk.gray;
yargs(hideBin(process.argv))
    .command(
        '$0 <files..>',
        'Create copies of the given files.',
        (yargsInstance) =>
            yargsInstance
                .positional('files', {
                    description: 'Files to be archived',
                    normalize: true,
                    array: true,
                    demandOption: true,
                })
                .option('suffix', {
                    alias: 's',
                    string: true,
                    description: 'Suffix template (dayjs)',
                    default: '_YYYY.MM.DD-HH.mm.ss',
                })
                .option('last-modified', {
                    alias: 'm',
                    boolean: true,
                    description:
                        'Use last modified time instead of current time',
                    default: false,
                }),
        (argv) => {
            const now = dayjs();

            Promise.all(
                argv.files.map(async (filePath) => {
                    if (!existsSync(filePath)) {
                        console.log(
                            `${WARNING_LABEL} Skipped ${filePath} ` +
                                secondaryText('(not found)'),
                        );
                        return;
                    }

                    const fileExtension = path.extname(filePath);
                    const filePathWithoutExt = filePath.slice(
                        0,
                        filePath.length - fileExtension.length,
                    );
                    const time = argv.lastModified
                        ? dayjs((await stat(filePath)).mtime)
                        : now;
                    const suffix = time.format(argv.suffix);
                    const newFilePath =
                        filePathWithoutExt + suffix + fileExtension;

                    if (existsSync(newFilePath)) {
                        console.log(`${WARNING_LABEL} Updated ${newFilePath}`);
                    } else {
                        console.log(`${WARNING_LABEL} Created ${newFilePath}`);
                    }

                    return copyFile(filePath, newFilePath);
                }),
            ).then(
                () => {
                    console.log(`${INFO_LABEL} Done.`);
                },
                (error) => {
                    console.error(`${ERROR_LABEL} An error occurred!`);
                    console.error(error);
                    process.exit(1);
                },
            );
        },
    )
    .parse();
