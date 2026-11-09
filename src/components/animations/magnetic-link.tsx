'use client';

import type { PointerEvent, ReactNode } from 'react';

export function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const anchor = event.currentTarget;
    const bounds = anchor.getBoundingClientRect();
    anchor.style.setProperty('--magnet-x', ((event.clientX - bounds.left) / bounds.width - .5) * 9 + 'px');
    anchor.style.setProperty('--magnet-y', ((event.clientY - bounds.top) / bounds.height - .5) * 6 + 'px');
  }

  function leave(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.removeProperty('--magnet-x');
    event.currentTarget.style.removeProperty('--magnet-y');
  }

  return (
    <a className="button button-primary" href={href} onPointerMove={move} onPointerLeave={leave}>
      <span className="magnetic-content">{children}</span>
    </a>
  );
}
