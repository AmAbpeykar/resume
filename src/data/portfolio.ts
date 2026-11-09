import type messages from '@/messages/en.json';

export const sections = ['home', 'about', 'skills', 'projects', 'experience', 'philosophy', 'contact'] as const;
export type Section = (typeof sections)[number];

type SkillItem = string | { key: keyof typeof messages.skills.items };
type Category = keyof typeof messages.skills.categories;

export const skills = {
  web: [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
    'React Native', 'Native Builds',
  ],
  backend: [
    'PHP', 'Laravel', 'NestJS', 'Express', 'GraphQL', 'WebSockets',
    'Jobs & Queues', 'MCP Development', 'Agent Development',
  ],
  data: [
    'SQL Server', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Object Storage',
  ],
  architecture: [
    'Strategy Pattern', 'SOLID', 'Microservices', 'Monolithic Architecture',
  ],
  quality: [
    'Ubuntu', 'Observability', 'Integration Testing', 'Unit Testing', 'E2E Testing', { key: 'seo' },
  ],
} satisfies Record<Category, SkillItem[]>;

export const categories = ['web', 'backend', 'architecture', 'data', 'quality'] as const satisfies readonly Category[];

export const projects = [
  {
    id: 'dambal',
    name: 'Dambal',
    url: 'https://dambalapp.com',
    technologies: ['React Native', 'Expo', 'Laravel', 'SQL Server', 'Redis', 'Elasticsearch', 'WebSockets'],
  },
  {
    id: 'drsinu',
    name: 'DrSinu',
    url: 'https://drsinu.com/',
    technologies: ['Next.js', 'React', 'TypeScript', 'Laravel', 'SQL Server', 'Redis', 'Docker'],
  },
] as const;

export const experience = ['product', 'systems', 'operations'] as const;
export const principles = ['architecture', 'production', 'performance', 'ownership', 'learning'] as const;
