'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type PointerEvent, type ReactNode } from 'react';

export function PortraitMotion({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 44], { clamp: true });
  const scale = useTransform(scrollY, [0, 700], [1, 1.055], { clamp: true });

  function track(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--photo-x', x * 10 + 'px');
    event.currentTarget.style.setProperty('--photo-y', y * 10 + 'px');
  }

  function reset() {
    stage.current?.style.removeProperty('--photo-x');
    stage.current?.style.removeProperty('--photo-y');
  }

  return (
    <div ref={stage} className="portrait-stage" onPointerMove={track} onPointerLeave={reset}>
      <motion.div className="portrait-motion" style={reduce ? undefined : { y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
