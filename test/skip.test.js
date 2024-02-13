#!/usr/bin/env node
import assert from 'node:assert';
import test, { before } from 'node:test';
import { initTest, archive } from './utils.js';

const TEST_NAME = 'skip';

before(() => {
    initTest(TEST_NAME);
});

test(TEST_NAME, async () => {
    const output = archive('foo.txt');
    const outputLowercased = output.toLowerCase();
    assert(outputLowercased.includes('warning'));
    assert(outputLowercased.includes('skipped'));
});
