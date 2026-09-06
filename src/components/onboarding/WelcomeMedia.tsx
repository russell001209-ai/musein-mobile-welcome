'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { welcomeDemo } from './welcome-demo';
import { useWelcomeCopy } from './useWelcomeCopy';

interface WelcomeMediaProps {
  mode: 'still' | 'video';
}

export function WelcomeMedia({ mode }: WelcomeMediaProps) {
  const { copy: { media: t } } = useWelcomeCopy();
  const player = useRef<HTMLVideoElement>(null);
  const attempt = useRef(0);
  const descriptionId = useId();
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'slow' | 'error'>('idle');
  const [imageFailed, setImageFailed] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const poster = welcomeDemo.imageUrl;

  useEffect(() => {
    if (status !== 'loading') return;
    const timeout = window.setTimeout(() => setStatus('slow'), 15_000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function play(event: MouseEvent<HTMLButtonElement>) {
    const video = player.current;
    if (!video) return;
    const currentAttempt = ++attempt.current;
    if (document.activeElement === event.currentTarget) video.focus({ preventScroll: true });
    setStatus('loading');
    setStarted(true);
    try {
      if (video.error || status === 'slow' || status === 'error') {
        video.pause();
        video.load();
      }
      if (video.ended) video.currentTime = 0;
      await video.play();
    } catch {
      // Switching steps or retrying cancels old play promises. Ignore those.
      if (player.current === video && attempt.current === currentAttempt) setStatus('error');
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
      <div className="relative aspect-video overflow-hidden bg-black">
        {mode === 'still' ? (
          imageFailed ? <div className="flex h-full items-center justify-center p-5 text-center text-sm text-zinc-400"><p className="text-pretty">{t.alt}</p></div> : <Image key={imageAttempt} src={poster} alt={t.alt} fill unoptimized priority sizes="(max-width: 767px) 100vw, 620px" className="object-contain" onError={() => setImageFailed(true)} />
        ) : (
          <>
            <video
              ref={player}
              src={welcomeDemo.videoUrl}
              poster={poster}
              className="size-full object-contain"
              controls={started}
              playsInline
              muted
              preload="none"
              tabIndex={started ? 0 : -1}
              aria-label={t.videoLabel}
              aria-describedby={descriptionId}
              onPlaying={() => {
                setStarted(true);
                setStatus('playing');
              }}
              onWaiting={() => setStatus('loading')}
              onCanPlay={() => { if (player.current?.paused) setStatus(current => current === 'loading' || current === 'slow' ? 'paused' : current); }}
              onPause={() => { if (!player.current?.ended) setStatus(current => current === 'playing' ? 'paused' : current); }}
              onEnded={() => setStatus('ended')}
              onError={() => setStatus('error')}
            />
            {!started && status === 'idle' && (
              <div className="absolute inset-0 flex items-end justify-center p-4 sm:p-5">
                <Button icon={Play} onClick={play} size="lg" className="rounded-full bg-white text-sm !text-black shadow-lg hover:bg-white/90 dark:bg-white dark:hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  {t.watch}
                </Button>
              </div>
            )}
            {status === 'loading' && <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><p role="status" className="rounded-full bg-black/85 px-4 py-2 text-sm text-white">{t.loading}</p></div>}
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-zinc-400">
        <span id={descriptionId}>{mode === 'still' ? t.stillDisclosure : t.videoDisclosure}</span>
        <span className="shrink-0 tabular-nums">{mode === 'still' ? '16:9' : t.duration}</span>
      </div>
      {mode === 'video' && status === 'ended' && <div className="border-t border-white/10 px-4 py-2"><Button icon={RotateCcw} variant="ghost" onClick={play} className="min-h-11 w-full text-sm">{t.replay}</Button></div>}
      {mode === 'video' && (status === 'error' || status === 'slow') && (
        <div role="alert" className="border-t border-white/10 p-4 text-sm text-zinc-300">
          <p className="mb-3 text-pretty">{status === 'slow' ? t.slow : t.error}</p>
          <Button icon={RotateCcw} variant="outline" onClick={play} className="min-h-11">{t.retry}</Button>
        </div>
      )}
      {mode === 'still' && imageFailed && <div role="alert" className="border-t border-white/10 p-4 text-sm text-zinc-300"><p className="mb-3 text-pretty">{t.imageError}</p><Button icon={RotateCcw} variant="outline" onClick={() => { setImageFailed(false); setImageAttempt(value => value + 1); }} className="min-h-11">{t.imageRetry}</Button></div>}
    </div>
  );
}
