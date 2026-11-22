import { ArrowUpRight, BriefcaseBusiness, Code2, Globe2, Mail, Phone, Sparkle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { site } from '@/data/site';

const methods = [
  { id: 'phone', icon: Phone },
  { id: 'email', icon: Mail },
  { id: 'linkedin', icon: BriefcaseBusiness },
  { id: 'github', icon: Code2 },
  { id: 'profile', icon: Globe2 },
] as const;

export async function Contact() {
  const t = await getTranslations('contact');
  const links = methods.flatMap((method) => {
    const link = site.contact[method.id];
    return link ? [{ ...method, ...link }] : [];
  });

  return (
    <section id="contact" tabIndex={-1} className="contact-section" aria-labelledby="contact-title">
      <div className="contact-horizon" aria-hidden="true" />
      <div className="shell contact-content">
        <Reveal>
          <div className="contact-signal" aria-hidden="true"><Sparkle size={26} strokeWidth={1.4} /></div>
          <p className="eyebrow section-kicker"><span className="section-index" dir="ltr">06 /</span>{t('label')}</p>
          <h2 id="contact-title" className="display-title">
            {t('titleFirst')}{' '}<span>{t('titleLast')}</span>
          </h2>
          <p>{t('intro')}</p>
        </Reveal>
        {links.length > 0 && (
          <Reveal className="contact-link-reveal" once={false}>
            <ul className="contact-links">
              {links.map(({ id, icon: Icon, href, value }) => (
                <li key={id}>
                  <a className="button button-ghost contact-link" href={href}>
                    <span className="contact-link-title">
                      <span className="contact-link-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span>{t(id)}</span>
                    </span>
                    {value && <bdi dir="ltr">{value}</bdi>}
                    <ArrowUpRight size={14} className="directional" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
