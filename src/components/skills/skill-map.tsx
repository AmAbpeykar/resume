'use client';

import { Box, Code2, Database, Radio, Server, ShieldCheck, Workflow } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { categories } from '@/data/portfolio';

type Category = (typeof categories)[number];

export type SkillGroup = {
  id: Category;
  title: string;
  description: string;
  items: { label: string; latin: boolean }[];
};

const nodes = {
  web: { icon: Code2, path: 'M 50,50 L 36,33 L 25,27' },
  backend: { icon: Server, path: 'M 50,50 L 65,33 L 75,27' },
  data: { icon: Database, path: 'M 50,50 L 67,62 L 78,72' },
  architecture: { icon: Workflow, path: 'M 50,50 L 33,62 L 20,72' },
  quality: { icon: ShieldCheck, path: 'M 50,50 L 50,90.5' },
};

export function SkillMap({ groups, labels }: {
  groups: SkillGroup[];
  labels: { map: string; core: string; selector: string; stack: string };
}) {
  const [selection, setSelection] = useState({ id: 'web' as Category, direction: 0 });
  const selected = selection.id;
  const group = groups.find(({ id }) => id === selected) ?? groups[0];
  const ActiveIcon = nodes[group.id].icon;
  const switched = selection.direction !== 0;

  function select(id: Category) {
    setSelection((current) => current.id === id ? current : {
      id,
      direction: Math.sign(categories.indexOf(id) - categories.indexOf(current.id)),
    });
  }

  return (
    <div className="skill-system" data-category={selected} data-switched={switched} style={{ '--skill-direction': selection.direction } as CSSProperties}>
      <div className="skill-map" role="group" aria-label={labels.map}>
        <div className="map-caption micro" aria-hidden="true"><Radio size={13} /> {labels.selector}</div>
        <div className="map-constellation">
          <svg className="map-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {groups.map(({ id }) => (
              <path className="map-link" key={id} d={nodes[id].path} vectorEffect="non-scaling-stroke" data-active={selected === id} />
            ))}
            {switched && (
              <path key={selected} className="map-signal" d={nodes[selected].path} pathLength={1} vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          <div className="map-core" aria-hidden="true">
            <Box key={selected} className="map-core-icon" size={27} strokeWidth={1.35} />
            <span className="micro">{labels.core}</span>
            {switched && <span key={'wave-' + selected} className="map-core-wave" />}
          </div>
          {groups.map(({ id, title }) => {
            const Icon = nodes[id].icon;
            return (
              <button
                key={id}
                type="button"
                className={'map-node map-node-' + id}
                aria-pressed={selected === id}
                aria-controls="skill-toolkit"
                onClick={() => select(id)}
              >
                <Icon size={16} aria-hidden="true" />
                {title}
              </button>
            );
          })}
        </div>
      </div>
      <div className="skill-toolkit" id="skill-toolkit" aria-live="polite" aria-atomic="true">
        <p className="micro toolkit-kicker"><span aria-hidden="true" className="tiny-cross">+</span> {labels.stack}</p>
        <div key={group.id} className="toolkit-content">
          {switched && <span className="toolkit-sweep" aria-hidden="true" />}
          <div className="toolkit-title"><ActiveIcon size={25} aria-hidden="true" /><h3>{group.title}</h3></div>
          <p className="toolkit-description">{group.description}</p>
          <ul className="badges">
            {group.items.map(({ label, latin }, index) => (
              <li key={label} style={{ '--badge-index': index } as CSSProperties}>
                <bdi lang={latin ? 'en' : undefined} dir={latin ? 'ltr' : undefined}>{label}</bdi>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
