import { ArrowDown, ArrowDownRight, ScanLine, Sparkle } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { MagneticLink } from '@/components/animations/magnetic-link';
import { PortraitMotion } from './portrait-motion';
import { Starfield } from './starfield';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section id="home" tabIndex={-1} className="hero" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true" />
      <Starfield />
      <div className="hero-gridlines" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-kicker enter">
              <span className="signal-dot" aria-hidden="true" />
              {t('eyebrow')}
            </p>
            <h1 id="hero-title" className="hero-title enter">
              <span>{t('firstName')}</span>{' '}
              <span className="hero-surname">{t('lastName')}<span className="name-period" aria-hidden="true">.</span></span>
            </h1>
            <p className="hero-role enter">{t('role')}</p>
            <p className="hero-tagline enter">{t('tagline')}</p>
            <div className="hero-actions enter">
              <MagneticLink href="#projects">
                {t('work')}
                <ArrowDownRight className="directional" aria-hidden="true" size={17} />
              </MagneticLink>
              <a className="button button-ghost" href="#about">{t('about')}</a>
            </div>
          </div>
          <div className="hero-portrait">
            <PortraitMotion>
              <div className="portrait-halo" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-outer" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-inner" aria-hidden="true" />
              <div className="portrait-decoration portrait-decoration-start" aria-hidden="true"><Sparkle size={18} /></div>
              <div className="portrait-decoration portrait-decoration-end" aria-hidden="true"><Sparkle size={13} /></div>
              <figure className="portrait-frame">
                <div className="portrait-photo">
                  <Image src="/images/profile.webp" alt={t('portraitAlt')} width={640} height={640} loading="eager" fetchPriority="high" />
                  <div className="portrait-vignette" aria-hidden="true" />
                </div>
                <span className="frame-corner corner-1" aria-hidden="true" />
                <span className="frame-corner corner-2" aria-hidden="true" />
                <span className="frame-corner corner-3" aria-hidden="true" />
                <span className="frame-corner corner-4" aria-hidden="true" />
                <figcaption className="portrait-caption micro">
                  <span><ScanLine size={13} aria-hidden="true" /> {t('portraitLabel')}</span>
                  <span>{t('imageIndex')}</span>
                </figcaption>
              </figure>
            </PortraitMotion>
          </div>
        </div>
        <div className="hero-bottom micro">
          <a href="#about" className="scroll-link">
            <span className="scroll-icon"><ArrowDown size={15} aria-hidden="true" /></span>
            {t('scroll')}
          </a>
          <span className="hero-bottom-line" aria-hidden="true" />
          <span className="hero-fields"><span className="tiny-cross" aria-hidden="true">+</span> {t('fields')}</span>
        </div>
      </div>
    </section>
  );
}
