import type { Metadata, Viewport } from 'next';
import { MobileWelcome } from '@/components/onboarding/MobileWelcome';

export const metadata: Metadata = {
  title: { absolute: 'A little idea. A big adventure. | Musein' },
  description: 'A short, interactive introduction to creating images and videos with Musein.',
  robots: { index: false, follow: false },
};

// Override the root layout's zoom restriction for this mobile-first preview.
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, minimumScale: 1,
  maximumScale: 5, userScalable: true, viewportFit: 'cover', themeColor: '#000000',
};

export default function MobileWelcomePreviewPage() {
  return <MobileWelcome />;
}
