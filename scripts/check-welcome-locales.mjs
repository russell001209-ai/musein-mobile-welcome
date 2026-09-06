import assert from 'node:assert/strict';
import { welcomeCopy, getWelcomeLocale } from '../src/components/onboarding/welcome-copy.ts';

function flatten(value, path = '') {
  if (typeof value === 'string') return { [path]: value };
  return Object.assign({}, ...Object.entries(value).map(([key, child]) => flatten(child, `${path}.${key}`)));
}

function verifyLocales(english, chinese) {
  const en = flatten(english);
  const zh = flatten(chinese);
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort(), 'Both locales must cover exactly the same fields.');
  for (const key of Object.keys(en)) {
    assert(en[key].trim(), `Empty English: ${key}`);
    assert(zh[key].trim(), `Empty Chinese: ${key}`);
    assert.match(zh[key], /[\u4e00-\u9fff]/u, `Untranslated Chinese: ${key}`);
    assert(!/[\u4e00-\u9fff]/u.test(en[key]), `Chinese leaked into English: ${key}`);
  }
  return Object.keys(en).length;
}

const fields = verifyLocales(welcomeCopy.en, welcomeCopy.zh);
const missing = structuredClone(welcomeCopy.zh);
delete missing.media.error;
assert.throws(() => verifyLocales(welcomeCopy.en, missing));
const empty = structuredClone(welcomeCopy.zh);
empty.prompt.parts[0].detail = '';
assert.throws(() => verifyLocales(welcomeCopy.en, empty));
const untranslated = structuredClone(welcomeCopy.zh);
untranslated.desktop.copyError = welcomeCopy.en.desktop.copyError;
assert.throws(() => verifyLocales(welcomeCopy.en, untranslated));
assert.equal(getWelcomeLocale('zh'), 'zh');
for (const language of ['en', 'jp', 'ko', 'ms', '', 'invalid']) assert.equal(getWelcomeLocale(language), 'en');
console.log(`PASS: ${fields} matching bilingual fields, no empty/untranslated copy, missing/empty/untranslated bad fixtures rejected, safe locale fallback.`);
