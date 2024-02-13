#!/usr/bin/env node
import assert from 'node:assert';
import test, { before } from 'node:test';
import {
    initTest,
    write,
    archive,
    findCopies,
    sleep,
    setFileStructure,
    assertFileStructure,
} from './utils.js';

const TEST_NAME = 'basic';

before(() => {
    initTest(TEST_NAME);
    setFileStructure('.', {
        'foo.txt': 'foo-old',
        'bar.txt': 'bar-old',
    });
});

test(TEST_NAME, async () => {
    archive('foo.txt');

    const fooCopies0 = findCopies('.', 'foo', '.txt');
    assert(fooCopies0.length > 0, 'Failed to find the copy of foo.txt! (0)');
    assert.strictEqual(
        fooCopies0.length,
        1,
        'Found extra copies of foo.txt: ' + fooCopies0.join(', '),
    );
    assertFileStructure('.', {
        [fooCopies0[0]]: 'foo-old',
    });

    await sleep(1011);
    write('foo.txt', 'foo-new');
    archive('foo.txt');

    const fooCopies1 = findCopies('.', 'foo', '.txt', fooCopies0);
    assert(fooCopies1.length > 0, 'Failed to find the copy of foo.txt! (1)');
    assert.strictEqual(
        fooCopies1.length,
        1,
        'Found extra copies of foo.txt: ' + fooCopies1.join(', '),
    );
    assertFileStructure('.', {
        [fooCopies0[0]]: 'foo-old',
        [fooCopies1[0]]: 'foo-new',
    });

    const barCopies0 = findCopies('.', 'bar', '.txt');
    assert.strictEqual(
        barCopies0.length,
        0,
        'Found unexpected copies of bar.txt: ' + barCopies0.join(', '),
    );
});
