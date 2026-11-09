'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      glow.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0)';
      glow.dataset.visible = 'true';
    };

    const hide = () => { glow.dataset.visible = 'false'; };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}
