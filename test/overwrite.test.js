#!/usr/bin/env node
import assert from 'node:assert';
import test from 'node:test';
import {
    initTest,
    write,
    archive,
    findCopies,
    setFileStructure,
    assertFileStructure,
} from './utils.js';

const TEST_NAME = 'overwrite';

test.before(() => {
    initTest(TEST_NAME);
    setFileStructure('.', {
        'foo.txt': 'foo-old',
    });
});

test(TEST_NAME, async () => {
    const SUFFIX = '_archive';
    const EXPECTED_COPY_PATH = 'foo' + SUFFIX + '.txt';

    const output0 = archive('foo.txt', '-s', `[${SUFFIX}]`);
    assert(output0.includes('INFO'));
    assert(output0.includes('Created'));

    const fooCopies0 = findCopies('.', 'foo', '.txt');
    assert(fooCopies0.length > 0, 'Failed to find the copy of foo.txt!');
    assert.strictEqual(
        fooCopies0.length,
        1,
        'Found extra copies of foo.txt: ' + fooCopies0.join(', '),
    );
    assert.strictEqual(
        fooCopies0[0],
        EXPECTED_COPY_PATH,
        'Found incorrect copy of foo.txt: ' + fooCopies0[0],
    );
    assertFileStructure('.', {
        'foo.txt': 'foo-old',
        [fooCopies0[0]]: 'foo-old',
    });

    write('foo.txt', 'foo-new');

    const output1 = archive('foo.txt', '-s', `[${SUFFIX}]`);
    assert(output1.includes('WARNING'));
    assert(output1.includes('Updated'));

    const fooCopies1 = findCopies('.', 'foo', '.txt', fooCopies0);
    assert.strictEqual(
        fooCopies1.length,
        0,
        'Found extra copies of foo.txt: ' + fooCopies1.join(', '),
    );
    assertFileStructure('.', {
        'foo.txt': 'foo-new',
        [fooCopies0[0]]: 'foo-new',
    });
});
