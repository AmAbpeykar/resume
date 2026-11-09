import { ArrowUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-identity">
          <span className="brand-mark" aria-hidden="true">MA<span>.</span></span>
          <div><p>{t('common.name')}</p><p>{t('footer.credit')}</p></div>
        </div>
        <span className="footer-end micro"><span className="signal-dot" aria-hidden="true" />{t('footer.end')}</span>
        <a href="#home" className="back-to-top">
          <span>{t('common.backToTop')}</span><ArrowUp size={17} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
