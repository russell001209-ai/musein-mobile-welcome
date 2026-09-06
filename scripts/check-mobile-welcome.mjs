import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export function verifyWelcomeHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert(main, 'Tutorial content must be server-rendered.');
  assert.equal((main.match(/<h1\b/g) || []).length, 1, 'Exactly one visible heading.');
  assert.match(main, /A little idea/);
  assert.match(main, /A big adventure/);
  assert.match(main, /Show me how/);
  assert.match(main, /Pre-recorded Musein demo/);
  assert.match(html, /noindex, nofollow/, 'Preview stays out of search.');
  assert.match(html, /user-scalable=yes/, 'Pinch zoom must remain available.');
  assert.match(html, /lang="en"/, 'Tutorial has an English language boundary.');
  assert(!/autoplay/i.test(main), 'Do not autoplay on mobile or reduced-motion devices.');
  assert.match(main, /preload="none"/, 'Video only loads when requested.');
  assert.match(main, /playsInline|playsinline/, 'Video plays inline on mobile.');
  assert(!/[\u4e00-\u9fff]/u.test(main.replace(/<[^>]*>/g, '')), 'Visible copy must be English.');
}

if (process.argv.includes('--self-test')) {
  const valid = '<meta content="noindex, nofollow"><meta content="user-scalable=yes"><div lang="en"><main><h1>A little idea. A big adventure.</h1><button>Show me how</button><video preload="none" playsinline></video>Pre-recorded Musein demo</main></div>';
  verifyWelcomeHtml(valid);
  for (const broken of [valid.replace('noindex, nofollow', 'index, follow'), valid.replace('user-scalable=yes', 'user-scalable=no'), valid.replace('preload="none"', 'preload="auto" autoplay'), valid.replace('Pre-recorded Musein demo', 'Generated just now')]) {
    assert.throws(() => verifyWelcomeHtml(broken));
  }
  console.log('PASS: guard rejects indexing, zoom lock, autoplay and fake-generation regressions.');
} else {
  const base = new URL(process.argv[2] || 'http://127.0.0.1:3117');
  assert(['127.0.0.1', 'localhost'].includes(base.hostname), 'Run this against a local preview only.');
  const response = await fetch(new URL('/previews/mobile-welcome', base), { signal: AbortSignal.timeout(60_000) });
  assert.equal(response.status, 200);
  verifyWelcomeHtml(await response.text());
  const component = await readFile(new URL('../src/components/onboarding/MobileWelcome.tsx', import.meta.url), 'utf8');
  assert.match(component, /copyWelcomeLink\(welcomeDemo\.desktopUrl, navigator\.clipboard\)/);
  const copy = await readFile(new URL('../src/components/onboarding/welcome-copy.ts', import.meta.url), 'utf8');
  assert.match(copy, /Select and copy the link above/);
  assert.match(component, /from '@\/components\/ui\/tabs'/);
  assert.match(component, /aria-label=\{t.navigationLabel\}/);
  assert.match(component, /env\(safe-area-inset-bottom\)/);
  const media = await readFile(new URL('../src/components/onboarding/WelcomeMedia.tsx', import.meta.url), 'utf8');
  assert.match(copy, /Loading sample/);
  assert.match(copy, /Retry image/);
  assert.match(copy, /Watch again/);
  assert.match(component, /data-welcome-locale=\{locale\}/);
  assert.match(component, /setLanguage\(locale === 'en' \? 'zh' : 'en'\)/);
  for (const source of [component, media, await readFile(new URL('../src/components/onboarding/useWelcomeNavigation.ts', import.meta.url), 'utf8'), await readFile(new URL('../src/components/onboarding/welcome-navigation.ts', import.meta.url), 'utf8')]) {
    assert(!/\bfetch\s*\(|axios\.|setInterval\s*\(/.test(source), 'Tutorial components must not submit generation jobs or poll.');
  }
  console.log('PASS: local HTTP 200, SSR, noindex, English, zoom, sample disclosure, on-demand video and non-generating components.');
}
