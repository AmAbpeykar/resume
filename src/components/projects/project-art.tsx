import { Activity, Box, Dumbbell, ScanLine } from 'lucide-react';

export function ProjectArt({ variant, caption, index }: {
  variant: 'dambal' | 'drsinu';
  caption: string;
  index: string;
}) {
  return (
    <div className={'project-art art-' + variant} aria-hidden="true">
      <div className="art-grid" />
      <div className="art-label micro"><ScanLine size={14} /> {caption}</div>
      {variant === 'dambal' ? (
        <div className="pulse-art">
          <div className="pulse-orbit pulse-orbit-outer" />
          <div className="pulse-orbit pulse-orbit-inner" />
          <svg className="pulse-wave" viewBox="0 0 440 100" fill="none">
            <path d="M0 59H83L100 47L111 68L123 19L139 89L153 57H274L286 43L297 62L312 27L328 79L340 59H440" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="pulse-token"><Dumbbell size={58} strokeWidth={1.3} /></div>
        </div>
      ) : (
        <div className="systems-art">
          <div className="system-plane plane-base"><div /><div /><div /></div>
          <div className="system-plane plane-middle"><div /><div /><div /></div>
          <div className="system-plane plane-top"><Box size={46} strokeWidth={1.3} /></div>
          <div className="system-beam beam-a" /><div className="system-beam beam-b" />
        </div>
      )}
      <div className="art-index micro"><Activity size={13} /> <span dir="ltr">{index} / 02</span></div>
    </div>
  );
}
