'use client';

import { useInView } from 'motion/react';
import { useRef, type CSSProperties, type ReactNode } from 'react';

export function Reveal({ children, className, delay = 0, once = true }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.18 });

  return (
    <div
      ref={ref}
      className={'reveal' + (className ? ' ' + className : '')}
      data-in-view={inView}
      style={{ '--reveal-delay': delay + 'ms' } as CSSProperties}
    >
      {children}
    </div>
  );
}
