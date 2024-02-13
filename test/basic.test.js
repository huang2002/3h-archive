#!/usr/bin/env node
import assert from 'node:assert';
import test, { before } from 'node:test';
import {
    beforeTest,
    write,
    archive,
    findCopies,
    read,
    sleep,
} from './utils.js';

const TEST_NAME = 'basic';

before(() => {
    beforeTest(TEST_NAME);
});

test(TEST_NAME, async () => {
    archive('foo.txt', '404.txt');

    const fooCopies0 = findCopies('.', 'foo', '.txt');
    assert(fooCopies0.length > 0, 'Failed to find the copy of foo.txt! (0)');
    assert.strictEqual(
        fooCopies0.length,
        1,
        'Found extra copies of foo.txt: ' + fooCopies0.join(', '),
    );
    assert.strictEqual(read(fooCopies0[0]), 'foo-old');

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
    assert.strictEqual(read(fooCopies0[0]), 'foo-old');
    assert.strictEqual(read(fooCopies1[0]), 'foo-new');

    const barCopies0 = findCopies('.', 'bar', '.txt');
    assert.strictEqual(
        barCopies0.length,
        0,
        'Found unexpected copies of bar.txt: ' + barCopies0.join(', '),
    );

    const bazCopies0 = findCopies('.', 'baz', '.txt');
    assert.strictEqual(
        bazCopies0.length,
        0,
        'Found unexpected copies of baz.txt: ' + bazCopies0.join(', '),
    );
});
