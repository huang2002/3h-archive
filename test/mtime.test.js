#!/usr/bin/env node
import assert from 'node:assert';
import test from 'node:test';
import {
    initTest,
    archive,
    findCopies,
    sleep,
    setFileStructure,
    assertFileStructure,
} from './utils.js';

const TEST_NAME = 'mtime';

test.before(() => {
    initTest(TEST_NAME);
    setFileStructure('.', {
        'foo.txt': 'foo-old',
    });
});

test(TEST_NAME, async () => {
    const output0 = archive('foo.txt', '-m');
    assert(output0.includes('INFO'));
    assert(output0.includes('Created'));

    const fooCopies0 = findCopies('.', 'foo', '.txt');
    assert(fooCopies0.length > 0, 'Failed to find the copy of foo.txt! (0)');
    assert.strictEqual(
        fooCopies0.length,
        1,
        'Found extra copies of foo.txt: ' + fooCopies0.join(', '),
    );
    assertFileStructure('.', {
        'foo.txt': 'foo-old',
        [fooCopies0[0]]: 'foo-old',
    });

    await sleep(1011);
    const output1 = archive('foo.txt', '-m');
    assert(output1.includes('WARNING'));
    assert(output1.includes('Updated'));

    const fooCopies1 = findCopies('.', 'foo', '.txt', fooCopies0);
    assert.strictEqual(
        fooCopies1.length,
        0,
        'Found unexpected copies of foo.txt: ' + fooCopies1.join(', '),
    );
    assertFileStructure('.', {
        'foo.txt': 'foo-old',
        [fooCopies0[0]]: 'foo-old',
    });
});
