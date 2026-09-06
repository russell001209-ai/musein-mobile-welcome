'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { WelcomeMedia } from './WelcomeMedia';
import { welcomeDemo, welcomeSteps, type WelcomeStepId } from './welcome-demo';
import { adjacentView, copyWelcomeLink } from './welcome-navigation';
import { useWelcomeNavigation } from './useWelcomeNavigation';
import { useWelcomeCopy } from './useWelcomeCopy';

const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';
const primaryStyle = cn('min-h-12 w-full rounded-full bg-white text-base !text-black hover:bg-white/90 dark:bg-white dark:hover:bg-white/90', focusStyle);

function PromptExplorer() {
  const { copy: t, locale } = useWelcomeCopy();
  const [part, setPart] = useState(0);
  return (
    <Card className="rounded-2xl border-white/10 p-5 dark:border-white/10 dark:bg-zinc-950">
      <p className="text-sm text-zinc-400">{t.prompt.explore}</p>
      <div role="group" aria-label={t.prompt.explore} className="mt-3 flex flex-wrap gap-2">
        {t.prompt.parts.map((item, index) => (
          <Button key={index} size="sm" variant="outline" aria-pressed={part === index} onClick={() => setPart(index)} className={cn('min-h-11 rounded-full text-sm dark:border-white/15', part === index && 'border-[var(--muse-cyan)]/50 bg-[var(--muse-cyan)]/10 !text-[var(--muse-cyan)] dark:border-[var(--muse-cyan)]/50', focusStyle)}>{item.label}</Button>
        ))}
      </div>
      <div aria-live="polite" className="mt-4 min-h-16">
        <p className="text-pretty text-base leading-relaxed text-zinc-100">{t.prompt.parts[part].detail}</p>
      </div>
      {locale === 'zh' && (
        <section aria-labelledby="image-prompt-translation" className="mt-2 border-t border-white/10 pt-4">
          <h2 id="image-prompt-translation" className="text-balance text-sm font-medium text-zinc-400">{t.prompt.imageTranslationLabel}</h2>
          <p lang="zh-CN" className="mt-3 text-pretty text-sm leading-relaxed text-zinc-100">{welcomeDemo.image.promptTranslationZh}</p>
        </section>
      )}
      <details className="mt-2 border-t border-white/10 pt-2">
        <summary className={cn('flex min-h-11 cursor-pointer items-center text-sm text-zinc-400 underline underline-offset-4', focusStyle)}>{t.prompt.label}</summary>
        <p lang="en" className="pt-2 text-pretty text-sm leading-relaxed text-zinc-300">{welcomeDemo.image.prompt}</p>
        <p className="mt-3 text-xs text-zinc-400">{welcomeDemo.image.model} · {welcomeDemo.image.resolution} · 16:9</p>
      </details>
    </Card>
  );
}

function DesktopHandoff() {
  const { copy: t, locale } = useWelcomeCopy();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const linkField = useRef<HTMLInputElement>(null);

  async function copyLink() {
    setCopied(false);
    setCopyError(false);
    const result = await copyWelcomeLink(welcomeDemo.desktopUrl, navigator.clipboard);
    setCopied(result === 'copied');
    setCopyError(result === 'manual');
    if (result === 'manual') {
      requestAnimationFrame(() => { linkField.current?.focus(); linkField.current?.select(); });
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl py-4 text-center md:py-12">
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-zinc-950"><Monitor className="size-6 text-[var(--muse-cyan)]" aria-hidden="true" /></div>
      <h1 tabIndex={-1} data-screen-heading className={cn('text-balance leading-tight outline-none', locale === 'zh' ? 'font-serif text-4xl md:text-5xl' : "font-['Instrument_Serif',serif] text-5xl md:text-6xl")}>{t.desktop.title}<br /><span className={locale === 'en' ? 'italic' : ''}>{t.desktop.emphasis}</span></h1>
      <p className="mx-auto mt-5 max-w-sm text-pretty text-base leading-relaxed text-zinc-400">{t.desktop.description}</p>

      <div className="mt-6 space-y-3">
        {copyError && <><label htmlFor="desktop-link" className="sr-only">{t.desktop.linkLabel}</label><input ref={linkField} id="desktop-link" readOnly value={welcomeDemo.desktopUrl} onFocus={event => event.target.select()} className="min-h-11 w-full rounded-xl border border-white/15 bg-black px-3 text-center text-base text-zinc-400 outline-none focus:border-white/50" /></>}
        <Button icon={copied ? Check : Copy} onClick={copyLink} className={primaryStyle}>{copied ? t.desktop.copied : t.desktop.copy}</Button>
        <p role="status" className="min-h-5 text-pretty text-xs text-zinc-400">{copyError ? t.desktop.copyError : copied ? t.desktop.copySuccess : t.desktop.copyHint}</p>
        <a href={welcomeDemo.desktopUrl} className={cn('inline-flex min-h-11 items-center rounded-md text-sm text-zinc-300 underline underline-offset-4', focusStyle)}>{t.desktop.open}</a>
      </div>
      <details className="mx-auto mt-5 max-w-sm text-left"><summary className={cn('flex min-h-11 cursor-pointer items-center justify-center text-sm text-zinc-400', focusStyle)}>{t.desktop.explain}</summary><p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-400">{t.desktop.explanation}</p></details>
    </div>
  );
}

export function MobileWelcome() {
  const { copy: t, locale, setLanguage, isLoading } = useWelcomeCopy();
  const { view, navigate } = useWelcomeNavigation();
  const screen = view === 'intro' || view === 'desktop' ? view : 'tour';
  const step: WelcomeStepId = screen === 'tour' ? view as WelcomeStepId : 'idea';
  const [compare, setCompare] = useState('video');
  const currentStep = t.steps[step];
  const root = useRef<HTMLDivElement>(null);
  const preserveTabFocus = useRef(false);

  useEffect(() => {
    // Next refreshes its server metadata on fragment navigation. Apply the
    // selected language after that commit as well as after a language switch.
    const frame = requestAnimationFrame(() => { document.title = t.pageTitle; });
    return () => cancelAnimationFrame(frame);
  }, [t.pageTitle, view]);

  useEffect(() => {
    // Synchronize focus/scroll with route changes, including browser back/forward.
    // Radix retains focus during arrow-key tab navigation.
    if (preserveTabFocus.current) {
      preserveTabFocus.current = false;
      return;
    }
    const frame = requestAnimationFrame(() => {
      root.current?.querySelector<HTMLElement>('[data-screen-heading]')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);

  function start() {
    setCompare('video');
    navigate('idea');
  }

  function next() {
    navigate(adjacentView(view, 1));
  }

  return (
    <div ref={root} lang={locale === 'zh' ? 'zh-CN' : 'en'} data-welcome-locale={locale} className="dark min-h-dvh bg-black font-['Barlow','PingFang_SC','Microsoft_YaHei',sans-serif] text-zinc-100 selection:bg-[var(--muse-cyan)]/25" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <a href="#welcome-main" onClick={event => { event.preventDefault(); root.current?.querySelector<HTMLElement>('main')?.focus(); }} className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black">{t.skipToContent}</a>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-5 py-4 sm:px-8" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <a href="https://musein.ai/" aria-label={t.homepage} className={cn('flex min-h-11 shrink-0 items-center rounded-md', focusStyle)}><Image src="/logo_withWords_white.svg" width={1235} height={343} alt="Musein" className="h-auto w-24 sm:w-28" priority /></a>
        <div className="flex items-center gap-1">
          <Button variant="outline" aria-label={t.switchLanguage} title={t.switchLanguage} disabled={isLoading} onClick={() => setLanguage(locale === 'en' ? 'zh' : 'en')} className={cn('min-h-11 min-w-11 rounded-full px-3 text-sm', focusStyle)}><span lang={locale === 'en' ? 'zh-CN' : 'en'}>{locale === 'en' ? '中文' : 'EN'}</span></Button>
          {screen !== 'intro' && <Button variant="ghost" onClick={() => navigate(screen === 'desktop' ? 'intro' : 'desktop')} className={cn('min-h-11 px-2 text-sm', focusStyle)}>{screen === 'desktop' ? t.backToIntro : t.skipTour}</Button>}
        </div>
      </header>

      <main id="welcome-main" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-8 outline-none sm:px-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        {screen === 'intro' && (
          <div className="grid items-center gap-7 pb-4 pt-4 md:min-h-[70dvh] md:grid-cols-[0.85fr_1.15fr] md:gap-12 md:py-12">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm text-zinc-400"><span className="size-1.5 rounded-full bg-[var(--muse-cyan)]" />{t.intro.welcome}</p>
              <h1 tabIndex={-1} data-screen-heading className={cn('text-balance outline-none', locale === 'zh' ? 'font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl' : "font-['Instrument_Serif',serif] text-5xl leading-[1.08] sm:text-6xl lg:text-7xl")}>{t.intro.title}<br /><span className={locale === 'en' ? 'italic' : ''}>{t.intro.emphasis}</span></h1>
              <p className="mt-5 max-w-sm text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">{t.intro.description}</p>
              <div className="mt-7 hidden max-w-xs md:block"><Button suffixIcon={ArrowRight} onClick={start} className={primaryStyle}>{t.intro.start}</Button><p className="mt-3 text-center text-xs text-zinc-400">{t.intro.note}</p></div>
            </div>
            <div>
              <WelcomeMedia key="intro" mode="video" />
            </div>
            <div className="md:hidden"><Button suffixIcon={ArrowRight} onClick={start} className={primaryStyle}>{t.intro.start}</Button><p className="mt-3 text-center text-xs text-zinc-400">{t.intro.note}</p></div>
          </div>
        )}

        {screen === 'tour' && (
          <Tabs value={step} onValueChange={value => { preserveTabFocus.current = true; navigate(value as WelcomeStepId); }} className="gap-5 pb-28 pt-3 md:gap-6 md:py-8">
            <div className="flex items-center justify-between gap-3">
              <TabsList aria-label={t.stepsLabel} variant="ghost" className="!h-14 w-full max-w-md gap-1 rounded-full border border-white/10 p-1">
                {welcomeSteps.map((item, index) => <TabsTrigger key={item.id} value={item.id} className="min-h-11 rounded-full text-sm data-[state=active]:!bg-white data-[state=active]:!text-black"><span className="tabular-nums">{index + 1}.</span> {t.steps[item.id].label}</TabsTrigger>)}
              </TabsList>
            </div>
            <div className="grid items-start gap-6 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
              <div className="md:col-start-2 md:row-start-1">
                <h1 tabIndex={-1} data-screen-heading className={cn('text-balance leading-tight outline-none', locale === 'zh' ? 'font-serif text-3xl sm:text-4xl' : "font-['Instrument_Serif',serif] text-4xl sm:text-5xl")}>{currentStep.title}</h1>
                <p className="mt-3 text-pretty text-base leading-relaxed text-zinc-400">{currentStep.description}</p>
              </div>

              <div className={cn('md:col-start-1 md:row-span-3 md:row-start-1', step === 'idea' && 'hidden md:block')}>
                <WelcomeMedia key={`${step}-${compare}`} mode={step === 'motion' && compare === 'video' ? 'video' : 'still'} />
                {step === 'motion' && (
                  <Tabs value={compare} onValueChange={setCompare} className="mt-3 gap-0">
                    <TabsList aria-label={t.compare.label} className="!h-14 w-full rounded-full bg-zinc-950 p-1">
                      <TabsTrigger value="still" className="min-h-11 rounded-full">{t.compare.still}</TabsTrigger>
                      <TabsTrigger value="video" className="min-h-11 rounded-full">{t.compare.video}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="still" className="sr-only">{t.compare.stillHint}</TabsContent>
                    <TabsContent value="video" className="sr-only">{t.compare.videoHint}</TabsContent>
                  </Tabs>
                )}
              </div>

              <div className="min-w-0 md:col-start-2 md:row-start-2">
                <TabsContent value="idea" className="m-0"><PromptExplorer /></TabsContent>
                <TabsContent value="image" className="sr-only">{t.image.disclosure}</TabsContent>
                <TabsContent value="motion" className="m-0"><Card className="rounded-2xl border-white/10 p-5 dark:border-white/10 dark:bg-zinc-950">
                  <p className="mb-2 text-xs text-zinc-400">{t.prompt.motionLabel}</p>
                  <p className="text-pretty text-base leading-relaxed text-zinc-100">{t.prompt.motionText}</p>
                  <details className="mt-3 border-t border-white/10 pt-2">
                    <summary className={cn('flex min-h-11 cursor-pointer items-center text-sm text-zinc-400 underline underline-offset-4', focusStyle)}>{t.prompt.originalMotion}</summary>
                    <p lang="en" className="pt-2 text-pretty text-sm leading-relaxed text-zinc-300">{welcomeDemo.video.prompt}</p>
                    <p className="mt-3 text-xs text-zinc-400">{welcomeDemo.video.model} · {welcomeDemo.video.resolution} · {t.media.duration}</p>
                  </details>
                </Card></TabsContent>
              </div>

              <nav aria-label={t.navigationLabel} className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black pt-3 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] md:static md:col-start-2 md:row-start-3 md:border-0 md:p-0">
                <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-center gap-3 md:flex md:flex-col-reverse md:gap-2">
                  <Button icon={ArrowLeft} onClick={() => navigate(adjacentView(view, -1))} variant="ghost" className={cn('min-h-12 rounded-full px-3 text-sm md:w-full', focusStyle)}>{t.back}</Button>
                  <Button suffixIcon={ArrowRight} onClick={next} className={cn(primaryStyle, '!h-auto py-3 text-sm md:text-base')}>{currentStep.next}</Button>
                </div>
              </nav>
            </div>
          </Tabs>
        )}

        {screen === 'desktop' && <DesktopHandoff />}
      </main>
    </div>
  );
}
