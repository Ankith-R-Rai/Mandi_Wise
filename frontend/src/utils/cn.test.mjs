// frontend/src/utils/cn.test.mjs
import assert from 'node:assert/strict';
import { cn } from './cn.ts';

assert.equal(cn('px-4', 'py-2', false && 'hidden', true && 'text-forest'), 'px-4 py-2 text-forest');
assert.equal(cn('base', undefined, null, 'active'), 'base active');
assert.equal(cn('m-2', true ? 'p-4' : 'p-2'), 'm-2 p-4');
assert.equal(cn(['col-1', 'col-2'], 'active'), 'col-1 col-2 active');
console.log('PASS: cn utility test');
