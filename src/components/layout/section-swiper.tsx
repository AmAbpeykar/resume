'use client';

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { sections, type Section } from '@/data/portfolio';
import { Navigation, type NavigationProps } from './navigation';

const effects = ['orbit', 'hinge', 'shutter'] as const;

type Destination = {
  index: number;
  history?: 'push' | 'replace';
  focus?: boolean;
};

type Scene = {
  index: number;
  previous: number | null;
  focus: boolean;
};

function sectionIndex(hash: string) {
  return sections.findIndex((section) => '#' + section === hash);
}

function canScroll(pane: HTMLElement, direction: number) {
  return direction < 0 ? pane.scrollTop > 1 : pane.scrollHeight - pane.clientHeight - pane.scrollTop > 1;
}

export function SectionSwiper({ panels, skipLabel, ...navigation }: NavigationProps & {
  panels: Record<Section, ReactNode>;
  skipLabel: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const panes = useRef<Array<HTMLDivElement | null>>([]);
  const scrollPositions = useRef<number[]>([]);
  const controller = useRef<{ navigate: (destination: Destination) => void; finish: () => void }>(null);
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    const stage = container.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialIndex = Math.max(0, sectionIndex(window.location.hash));
    let current: Scene = { index: initialIndex, previous: null, focus: false };
    let queued: Destination | null = null;
    let timer: number | undefined;
    let lastWheel = -Infinity;
    let wheelDirection = 0;
    let usedGesture = false;
    let touchStart: { x: number; y: number; up: boolean; down: boolean } | null = null;

    function commit(next: Scene) {
      current = next;
      setScene(next);
    }

    function navigate({ index, history, focus = false }: Destination) {
      const section = sections[index];
      if (!section) return;

      if (history) {
        const hash = history === 'replace' && section === 'home' ? '' : '#' + section;
        if (window.location.hash !== hash) {
          const url = window.location.pathname + window.location.search + hash;
          if (history === 'push') window.history.pushState(window.history.state, '', url);
          else window.history.replaceState(window.history.state, '', url);
        }
      }

      if (current.previous !== null) {
        queued = { index, focus };
        return;
      }

      if (current.index === index) {
        if (focus) document.getElementById(section)?.focus({ preventScroll: true });
        return;
      }

      const pane = panes.current[current.index];
      if (pane) scrollPositions.current[current.index] = pane.scrollTop;

      const previous = reduceMotion.matches ? null : current.index;
      commit({ index, previous, focus: focus || Boolean(pane?.contains(document.activeElement)) });

      // Animation end settles the scene. The timer also covers interrupted CSS animations.
      if (previous !== null) timer = window.setTimeout(finish, 1050);
    }

    function finish() {
      if (current.previous === null) return;
      window.clearTimeout(timer);
      const next = queued;
      queued = null;
      commit({ ...current, previous: null, focus: next ? false : current.focus });
      if (next) navigate(next);
    }

    function move(direction: number, focus: boolean) {
      if (current.previous !== null) return;
      navigate({ index: current.index + direction, history: 'replace', focus });
    }

    function onWheel(event: WheelEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (document.querySelector('dialog[open]') || (event.target instanceof Element && event.target.closest('#mobile-navigation'))) return;

      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      if (now - lastWheel > 160 || direction !== wheelDirection) usedGesture = false;
      lastWheel = now;
      wheelDirection = direction;
      event.preventDefault();

      if (current.previous !== null) {
        usedGesture = true;
        return;
      }

      const pane = panes.current[current.index];
      if (pane && canScroll(pane, direction)) {
        const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pane.clientHeight : 1;
        pane.scrollBy({ top: event.deltaY * scale, behavior: 'instant' });
        usedGesture = true;
        return;
      }
      if (usedGesture || Math.abs(event.deltaY) < 2) return;
      usedGesture = true;
      move(direction, false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (document.querySelector('#mobile-navigation, dialog[open]')) return;
      const target = event.target;
      if (target instanceof HTMLElement && (
        target.isContentEditable || target.closest('input, textarea, select') ||
        (event.key === ' ' && target.closest('button, summary, a'))
      )) return;

      const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 :
        ['ArrowUp', 'PageUp'].includes(event.key) ? -1 :
        event.key === ' ' ? (event.shiftKey ? -1 : 1) : 0;
      if (!direction) return;

      event.preventDefault();
      if (current.previous !== null) return;

      const pane = panes.current[current.index];
      if (pane && canScroll(pane, direction)) {
        const distance = event.key.startsWith('Arrow') ? 48 : pane.clientHeight * 0.85;
        pane.scrollBy({ top: direction * distance, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
        return;
      }
      if (!event.repeat) move(direction, true);
    }

    function onTouchStart(event: TouchEvent) {
      touchStart = null;
      const pane = panes.current[current.index];
      if (current.previous !== null || event.touches.length !== 1 || !pane || document.querySelector('#mobile-navigation, dialog[open]')) return;
      const { clientX, clientY } = event.touches[0];
      touchStart = { x: clientX, y: clientY, up: canScroll(pane, -1), down: canScroll(pane, 1) };
    }

    function onTouchEnd(event: TouchEvent) {
      const start = touchStart;
      touchStart = null;
      if (!start || event.touches.length !== 0) return;

      const { clientX, clientY } = event.changedTouches[0];
      const dy = start.y - clientY;
      if (Math.abs(dy) < 54 || Math.abs(dy) < Math.abs(start.x - clientX) * 1.35) return;
      if (dy > 0 ? start.down : start.up) return;
      move(Math.sign(dy), false);
    }

    function onTouchCancel() {
      touchStart = null;
    }

    function onHashChange() {
      const index = sectionIndex(window.location.hash);
      if (index >= 0 || !window.location.hash) navigate({ index: Math.max(0, index) });
    }

    function onMotionChange() {
      if (reduceMotion.matches) finish();
    }

    controller.current = { navigate, finish };
    commit(current);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHashChange);
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });
    stage.addEventListener('touchcancel', onTouchCancel, { passive: true });
    reduceMotion.addEventListener('change', onMotionChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHashChange);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchend', onTouchEnd);
      stage.removeEventListener('touchcancel', onTouchCancel);
      reduceMotion.removeEventListener('change', onMotionChange);
      controller.current = null;
    };
  }, []);

  const activeIndex = scene?.index;
  useLayoutEffect(() => {
    if (activeIndex === undefined) return;
    const pane = panes.current[activeIndex];
    if (pane) pane.scrollTop = scrollPositions.current[activeIndex] ?? 0;
  }, [activeIndex]);

  useEffect(() => {
    if (scene?.focus && scene.previous === null) {
      document.getElementById(sections[scene.index])?.focus({ preventScroll: true });
    }
  }, [scene]);

  function followLink(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!controller.current || !scene || !(event.target instanceof Element)) return;
    const href = event.target.closest('a')?.getAttribute('href');
    if (!href?.startsWith('#')) return;

    const skip = href === '#main-content';
    const index = skip ? scene.index : sectionIndex(href);
    if (index < 0) return;
    event.preventDefault();
    controller.current.navigate({ index, history: skip ? undefined : 'push', focus: true });
  }

  const previous = scene?.previous ?? null;
  const effect = scene && previous !== null ? effects[Math.max(scene.index, previous) % effects.length] : undefined;

  return (
    <div onClickCapture={followLink}>
      <a className="skip-link" href="#main-content">{skipLabel}</a>
      <Navigation {...navigation} active={sections[activeIndex ?? 0]} />
      <main id="main-content" tabIndex={-1}>
        <div
          ref={container}
          className="portfolio-swiper"
          data-ready={scene ? '' : undefined}
          data-effect={effect}
          data-direction={scene && previous !== null ? (scene.index > previous ? 'forward' : 'backward') : undefined}
        >
          {sections.map((section, index) => (
            <div
              key={section}
              className="portfolio-slide"
              data-slide={index === activeIndex ? (effect ? 'incoming' : 'active') : index === previous ? 'outgoing' : undefined}
              inert={scene !== null && index !== activeIndex}
              onAnimationEnd={(event) => {
                if (effect && index === activeIndex && event.target === event.currentTarget) controller.current?.finish();
              }}
            >
              <div className="section-pane" ref={(pane) => { panes.current[index] = pane; }}>{panels[section]}</div>
            </div>
          ))}
          {effect && (
            <div className="slide-light" aria-hidden="true">
              <span />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
