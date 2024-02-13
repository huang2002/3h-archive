#!/usr/bin/env node
import assert from 'node:assert';
import test, { before } from 'node:test';
import { beforeTest, write, archive, findCopies, read } from './utils.js';

const TEST_NAME = 'overwrite';

before(() => {
    beforeTest(TEST_NAME);
});

test(TEST_NAME, async () => {
    const SUFFIX = '_archive';

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
        'foo' + SUFFIX + '.txt',
        'Found incorrect copy of foo.txt!',
    );
    assert.strictEqual(read(fooCopies0[0]), 'foo-old');

    write('foo.txt', 'foo-new');
    archive('foo.txt', '-s', `[${SUFFIX}]`);

    const fooCopies1 = findCopies('.', 'foo', '.txt', fooCopies0);
    assert.strictEqual(
        fooCopies1.length,
        0,
        'Found extra copies of foo.txt: ' + fooCopies1.join(', '),
    );
    assert.strictEqual(read(fooCopies0[0]), 'foo-new');

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
