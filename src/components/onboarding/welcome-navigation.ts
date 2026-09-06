export const welcomeViews = ['intro', 'idea', 'image', 'motion', 'desktop'] as const;
export type WelcomeView = typeof welcomeViews[number];

export function viewFromHash(hash: string): WelcomeView {
  const candidate = hash.slice(1);
  return welcomeViews.find(view => view === candidate) ?? 'intro';
}

export function adjacentView(view: WelcomeView, direction: -1 | 1): WelcomeView {
  const index = welcomeViews.indexOf(view);
  return welcomeViews[Math.max(0, Math.min(welcomeViews.length - 1, index + direction))];
}

// A missing or denied clipboard must never be reported as a successful copy.
export async function copyWelcomeLink(
  value: string,
  clipboard?: Pick<Clipboard, 'writeText'>,
): Promise<'copied' | 'manual'> {
  if (!clipboard) return 'manual';
  try {
    await clipboard.writeText(value);
    return 'copied';
  } catch {
    return 'manual';
  }
}
