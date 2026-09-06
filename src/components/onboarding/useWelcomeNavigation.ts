'use client';

import { useSyncExternalStore } from 'react';
import { viewFromHash, type WelcomeView } from './welcome-navigation';

const navigationEvent = 'musein-welcome:navigate';

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener('hashchange', onChange);
  window.addEventListener(navigationEvent, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener(navigationEvent, onChange);
  };
}

function getSnapshot() { return viewFromHash(window.location.hash); }
function getServerSnapshot(): WelcomeView { return 'intro'; }

export function useWelcomeNavigation() {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function navigate(next: WelcomeView) {
    if (next === getSnapshot()) return;
    const url = new URL(window.location.href);
    url.hash = next === 'intro' ? '' : next;
    // Only this tutorial's fragment changes. No account data or project is saved.
    window.history.pushState(null, '', url);
    window.dispatchEvent(new Event(navigationEvent));
  }

  return { view, navigate };
}
