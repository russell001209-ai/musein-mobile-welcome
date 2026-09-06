import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { welcomeDemo } from '../src/components/onboarding/welcome-demo.ts';

const sha256 = text => createHash('sha256').update(text).digest('hex');

export function verifyCase(demo) {
  assert.equal(demo.provenance, 'generated-in-musein');
  assert.match(demo.canvasUrl, /^https:\/\/musein\.ai\/workspace\/[a-f0-9-]+$/);
  for (const kind of ['image', 'video']) {
    const asset = demo[kind];
    assert.equal(asset.status, 'completed', `${kind} must be an actual completed task.`);
    assert.match(asset.taskId, /^[a-f0-9-]{36}$/);
    assert.equal(new URL(asset.outputUrl).hostname, 'files.musein.ai');
    assert(asset.outputUrl.includes(asset.taskId), `${kind} output must belong to the recorded task.`);
    assert(asset.model && asset.prompt.trim());
    assert.equal(sha256(asset.prompt), asset.promptSha256, `${kind} original prompt changed without re-verification.`);
  }
  assert.equal(demo.video.inputImageUrl, demo.image.outputUrl, 'Video must use the displayed generated image, not a frame from the output.');
  assert.notEqual(demo.image.outputUrl, demo.video.outputUrl);
  assert.equal(demo.imageUrl, demo.image.outputUrl);
  assert.equal(demo.videoUrl, demo.video.outputUrl);
  assert(demo.video.durationSeconds > 0);
  assert.equal(typeof demo.image.promptTranslationZh, 'string', 'Keep a complete Chinese translation separate from the submitted English prompt.');
  for (const detail of ['宇航员', '白色宇航服', '橙色纸船', '青绿色', '太空', '带环行星', '繁星', '远景', '3D', '柔和光线', '文字或标志']) {
    assert(demo.image.promptTranslationZh.includes(detail), `Chinese image translation is missing: ${detail}`);
  }
}

verifyCase(welcomeDemo);
for (const [label, mutate] of [
  ['unverified placeholder', item => { item.provenance = 'homepage-sample'; }],
  ['pending result', item => { item.video.status = 'pending'; }],
  ['rewritten prompt', item => { item.image.prompt += ' A different scene.'; }],
  ['missing Chinese translation', item => { delete item.image.promptTranslationZh; }],
  ['incomplete Chinese translation', item => { item.image.promptTranslationZh = '宇航员坐在橙色纸船里。'; }],
  ['unrelated input image', item => { item.video.inputImageUrl = 'https://files.musein.ai/unrelated.jpg'; }],
  ['unrelated output', item => { item.video.outputUrl = 'https://files.musein.ai/unrelated.mp4'; }],
]) {
  const broken = structuredClone(welcomeDemo);
  mutate(broken);
  assert.throws(() => verifyCase(broken), label);
}

const media = await readFile(new URL('../src/components/onboarding/WelcomeMedia.tsx', import.meta.url), 'utf8');
const component = await readFile(new URL('../src/components/onboarding/MobileWelcome.tsx', import.meta.url), 'utf8');
assert(!/getVideoThumbnailUrl|frameTime/.test(media), 'A tutorial input image must not be extracted from the output video.');
assert.match(media, /welcomeDemo\.imageUrl/);
assert.match(component, /welcomeDemo\.image\.prompt/);
assert.match(component, /welcomeDemo\.video\.prompt/);
assert.match(component, /welcomeDemo\.image\.promptTranslationZh/);
assert.match(component, /t\.prompt\.imageTranslationLabel/);
assert(!/sampleSource|sampleTitle|welcomeDemo\.sourceUrl/.test(component), 'Do not restore the distracting homepage-source row.');
console.log('PASS: completed case, exact original prompts, complete Chinese image translation, matching image-to-video input, seven bad fixtures rejected, and UI uses verified assets.');
