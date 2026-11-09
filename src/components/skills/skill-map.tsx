'use client';

import { Box, Code2, Database, Radio, Server, ShieldCheck, Workflow } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
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
  const [selected, setSelected] = useState<Category>('web');
  const reduce = useReducedMotion();
  const group = groups.find(({ id }) => id === selected) ?? groups[0];
  const ActiveIcon = nodes[group.id].icon;

  return (
    <div className="skill-system">
      <div className="skill-map" role="group" aria-label={labels.map}>
        <div className="map-caption micro" aria-hidden="true"><Radio size={13} /> {labels.selector}</div>
        <div className="map-constellation">
          <svg className="map-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {groups.map(({ id }) => (
              <path key={id} d={nodes[id].path} vectorEffect="non-scaling-stroke" data-active={selected === id} />
            ))}
          </svg>
          <div className="map-core" aria-hidden="true">
            <Box size={27} strokeWidth={1.35} />
            <span className="micro">{labels.core}</span>
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
                onClick={() => setSelected(id)}
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={group.id}
            initial={reduce ? false : { opacity: 0.35, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0.35, y: -5 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
          >
            <div className="toolkit-title"><ActiveIcon size={25} aria-hidden="true" /><h3>{group.title}</h3></div>
            <p className="toolkit-description">{group.description}</p>
            <ul className="badges">
              {group.items.map(({ label, latin }) => (
                <li key={label}><bdi lang={latin ? 'en' : undefined} dir={latin ? 'ltr' : undefined}>{label}</bdi></li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
