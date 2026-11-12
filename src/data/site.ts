function webUrl(value?: string) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : undefined;
  } catch {
    return undefined;
  }
}

const siteUrl = webUrl(process.env.PORTFOLIO_SITE_URL);
const phone = '09109683260';
const email = (process.env.PORTFOLIO_EMAIL ?? 'amaabpeykar@gmail.com').trim();
const emailHref = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ? 'mailto:' + encodeURIComponent(email).replace('%40', '@')
  : undefined;
const github = webUrl(process.env.PORTFOLIO_GITHUB ?? 'https://github.com/AmAbpeykar');
const githubHandle = github?.pathname.match(/^\/([^/]+)\/?$/)?.[1];
const linkedin = webUrl(process.env.PORTFOLIO_LINKEDIN ?? 'https://www.linkedin.com/in/aimeup/');
const linkedinHandle = linkedin?.pathname.match(/^\/in\/([^/]+)\/?$/)?.[1];

function externalContact(url?: URL, value?: string) {
  return url && { href: url.href, value };
}

export const site = {
  origin: siteUrl ? new URL(siteUrl.origin) : undefined,
  contact: {
    phone: { href: 'tel:+98' + phone.slice(1), value: phone },
    email: emailHref ? { href: emailHref, value: email } : undefined,
    github: externalContact(github, githubHandle),
    linkedin: externalContact(linkedin, linkedinHandle),
    profile: externalContact(webUrl(process.env.PORTFOLIO_PROFILE_URL)),
  },
};
