'use client';

import { ArrowUpRight, Globe2, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { sections, type Section } from '@/data/portfolio';
import { localeHref, routing, type Locale } from '@/i18n/routing';

export type NavigationProps = {
  locale: Locale;
  labels: Record<Section | 'label' | 'language' | 'open' | 'close', string>;
  name: string;
};

const brandName = 'AimeUp';

export function Navigation({ locale, labels, name, active }: NavigationProps & { active: Section }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }

    const desktop = window.matchMedia('(min-width: 901px)');
    function onResize() {
      if (desktop.matches) setOpen(false);
    }

    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  return (
    <>
      <motion.div
        className="scroll-progress"
        initial={false}
        animate={{ scaleX: sections.indexOf(active) / (sections.length - 1) }}
        transition={{ duration: reduce ? 0 : 0.24 }}
        aria-hidden="true"
      />
      <header className="site-header">
        <nav aria-label={labels.label} className="navigation">
          <a href="#home" className="brand" aria-label={[brandName, name, labels.home].join(' · ')} onClick={() => setOpen(false)}>
            <span className="brand-mark brand-wordmark" aria-hidden="true">{brandName}</span>
          </a>
          <ul className="nav-links">
            {sections.map((section) => (
              <li key={section}>
                <a href={'#' + section} aria-current={active === section ? 'location' : undefined}>
                  {labels[section]}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <div className="language" role="group" aria-label={labels.language}>
              <Globe2 className="language-icon" aria-hidden="true" size={15} />
              <span className="language-options" dir="ltr">
                {routing.locales.map((target) => (
                  <a
                    key={target}
                    href={localeHref(target, active === 'home' ? undefined : active)}
                    hrefLang={target}
                    lang={target}
                    aria-label={target === 'en' ? 'EN · English' : 'FA · فارسی'}
                    aria-current={locale === target ? 'page' : undefined}
                    className={locale === target ? 'language-current' : undefined}
                  >
                    {target.toUpperCase()}
                  </a>
                ))}
              </span>
            </div>
            <button
              className="menu-toggle"
              type="button"
              ref={toggle}
              aria-expanded={open}
              aria-controls={open ? 'mobile-navigation' : undefined}
              aria-label={open ? labels.close : labels.open}
              onClick={() => setOpen(!open)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'close' : 'menu'}
                  initial={reduce ? false : { rotate: -22, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduce ? undefined : { rotate: 22, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.13 }}
                  aria-hidden="true"
                >
                  {open ? <X size={22} /> : <Menu size={22} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <motion.ul
                className="mobile-navigation"
                id="mobile-navigation"
                initial={reduce ? false : { opacity: 0, y: -9, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -9, scale: 0.98 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
              >
                {sections.map((section, index) => (
                  <li key={section}>
                    <a href={'#' + section} aria-current={active === section ? 'location' : undefined} onClick={() => setOpen(false)}>
                      <span className="micro menu-index" aria-hidden="true">0{index + 1}</span>
                      {labels[section]}
                      <ArrowUpRight size={17} className="directional" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
