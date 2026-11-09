'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import { sections, type Section } from '@/data/portfolio';
import { Navigation, type NavigationProps } from './navigation';

function sectionIndex(hash: string) {
  return sections.findIndex((section) => '#' + section === hash);
}

function activePane(swiper: Swiper) {
  return swiper.slides[swiper.activeIndex]?.querySelector<HTMLElement>('.section-pane');
}

function canScroll(pane: HTMLElement, direction: number) {
  return direction < 0 ? pane.scrollTop > 1 : pane.scrollHeight - pane.clientHeight - pane.scrollTop > 1;
}

export function SectionSwiper({ panels, skipLabel, ...navigation }: NavigationProps & {
  panels: Record<Section, ReactNode>;
  skipLabel: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<Swiper | null>(null);
  const pendingFocus = useRef<Section | null>(null);
  const [active, setActive] = useState<Section | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const initialSlide = Math.max(0, sectionIndex(window.location.hash));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const swiper = new Swiper(element, {
      direction: 'vertical',
      cssMode: true,
      initialSlide,
      on: {
        init: () => setActive(sections[initialSlide]),
        slideChange: ({ activeIndex, initialized }) => {
          if (!initialized) return;
          const section = sections[activeIndex];
          if (!section) return;
          setActive(section);
          const hash = section === 'home' ? '' : '#' + section;
          if (window.location.hash !== hash) {
            window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + hash);
          }
        },
      },
    });
    instance.current = swiper;
    window.scrollTo({ top: 0, behavior: 'instant' });

    let lastWheel = -Infinity;
    let wheelDirection = 0;
    let usedGesture = false;

    function slide(direction: number, focus: boolean) {
      const index = swiper.activeIndex + direction;
      const target = sections[index];
      if (!target) return;
      pendingFocus.current = focus ? target : null;
      swiper.slideTo(index, reduceMotion.matches ? 0 : 450);
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
      const pane = activePane(swiper);
      if (pane && canScroll(pane, direction)) {
        const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pane.clientHeight : 1;
        pane.scrollBy({ top: event.deltaY * scale, behavior: 'instant' });
        usedGesture = true;
        return;
      }
      if (usedGesture || Math.abs(event.deltaY) < 2) return;
      usedGesture = true;
      slide(direction, false);
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
      const pane = activePane(swiper);
      if (pane && canScroll(pane, direction)) {
        const distance = event.key.startsWith('Arrow') ? 48 : pane.clientHeight * 0.85;
        pane.scrollBy({ top: direction * distance, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
        return;
      }
      if (!event.repeat) slide(direction, true);
    }

    function onHashChange() {
      const index = Math.max(0, sectionIndex(window.location.hash));
      pendingFocus.current = null;
      swiper.slideTo(index, 0);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHashChange);
      instance.current = null;
      swiper.destroy();
    };
  }, []);

  useEffect(() => {
    if (active && pendingFocus.current === active) {
      pendingFocus.current = null;
      document.getElementById(active)?.focus({ preventScroll: true });
    }
  }, [active]);

  function followLink(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const swiper = instance.current;
    if (!swiper || !(event.target instanceof Element)) return;
    const link = event.target.closest('a');
    const href = link?.getAttribute('href');
    if (!href?.startsWith('#')) return;

    const index = href === '#main-content' ? swiper.activeIndex : sectionIndex(href);
    const target = sections[index];
    if (!target) return;
    event.preventDefault();
    if (href !== '#main-content' && window.location.hash !== href) {
      window.history.pushState(window.history.state, '', href);
    }
    if (swiper.activeIndex === index) {
      document.getElementById(target)?.focus({ preventScroll: true });
      return;
    }
    pendingFocus.current = target;
    const smooth = link?.classList.contains('back-to-top') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    swiper.slideTo(index, smooth ? 450 : 0);
  }

  return (
    <div onClickCapture={followLink}>
      <a className="skip-link" href="#main-content">{skipLabel}</a>
      <Navigation {...navigation} active={active ?? 'home'} />
      <main id="main-content" tabIndex={-1}>
        <div ref={container} className="swiper portfolio-swiper">
          <div className="swiper-wrapper">
            {sections.map((section) => (
              <div key={section} className="swiper-slide" inert={active !== null && section !== active}>
                <div className="section-pane">{panels[section]}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
