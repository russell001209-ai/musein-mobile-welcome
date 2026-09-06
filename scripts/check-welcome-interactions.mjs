import assert from 'node:assert/strict';
import { adjacentView, copyWelcomeLink, viewFromHash, welcomeViews } from '../src/components/onboarding/welcome-navigation.ts';

for (let i = 0; i < welcomeViews.length; i++) {
  const view = welcomeViews[i];
  assert.equal(viewFromHash(`#${view}`), view, 'Reload restores each valid step.');
  assert.equal(adjacentView(view, 1), welcomeViews[Math.min(i + 1, 4)]);
  assert.equal(adjacentView(view, -1), welcomeViews[Math.max(0, i - 1)]);
}
for (const hash of ['', '#unknown', '#%69dea', '#https://evil.example', '#__proto__']) {
  assert.equal(viewFromHash(hash), 'intro', 'Invalid fragments return to intro, never redirect.');
}
const expected = 'https://musein.ai/workspace';
let written;
assert.equal(await copyWelcomeLink(expected, { writeText: async value => { written = value; } }), 'copied');
assert.equal(written, expected);
assert.equal(await copyWelcomeLink(expected), 'manual', 'Missing clipboard exposes manual copy.');
assert.equal(await copyWelcomeLink(expected, { writeText: async () => { throw new Error('Permission denied'); } }), 'manual');
assert.equal(await copyWelcomeLink(expected, { writeText: () => { throw new Error('Unavailable'); } }), 'manual');
console.log('PASS: five step routes, forward/back boundaries, five invalid fragments, clipboard success/missing/denied/throwing.');
