#!/usr/bin/env node
import assert from 'node:assert';
import test, { before } from 'node:test';
import {
    initTest,
    write,
    archive,
    findCopies,
    read,
    setFileStructure,
    assertFileStructure,
} from './utils.js';

const TEST_NAME = 'overwrite';

before(() => {
    initTest(TEST_NAME);
    setFileStructure('.', {
        'foo.txt': 'foo-old',
        'bar.txt': 'bar-old',
    });
});

test(TEST_NAME, async () => {
    const SUFFIX = '_archive';
    const EXPECTED_COPY_PATH = 'foo' + SUFFIX + '.txt';

    archive('foo.txt', '-s', `[${SUFFIX}]`);

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
        [fooCopies0[0]]: 'foo-old',
    });

    write('foo.txt', 'foo-new');
    archive('foo.txt', '-s', `[${SUFFIX}]`);

    const fooCopies1 = findCopies('.', 'foo', '.txt', fooCopies0);
    assert.strictEqual(
        fooCopies1.length,
        0,
        'Found extra copies of foo.txt: ' + fooCopies1.join(', '),
    );
    assertFileStructure('.', {
        [fooCopies0[0]]: 'foo-new',
    });

    const barCopies0 = findCopies('.', 'bar', '.txt');
    assert.strictEqual(
        barCopies0.length,
        0,
        'Found unexpected copies of bar.txt: ' + barCopies0.join(', '),
    );
});
