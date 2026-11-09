import { Reveal } from '@/components/animations/reveal';

export function SectionHeading({ index, id, label, title, intro }: {
  index: string;
  id: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow section-kicker"><span className="section-index" dir="ltr">{index} /</span>{label}</p>
      <h2 id={id} className="display-title">{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </Reveal>
  );
}
