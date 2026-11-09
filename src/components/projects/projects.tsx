import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { projects } from '@/data/portfolio';
import { ProjectArt } from './project-art';
import { ProjectDetails } from './project-details';

export async function Projects() {
  const t = await getTranslations('projects');

  return (
    <section id="projects" tabIndex={-1} className="section shell projects-section" aria-labelledby="projects-title">
      <SectionHeading index="03" id="projects-title" label={t('label')} title={t('title')} intro={t('intro')} />
      <div className="project-list">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={70}>
            <article className="project-card" aria-labelledby={project.id + '-title'}>
              <ProjectArt variant={project.id} caption={t(`${project.id}.visual`)} index={'0' + (index + 1)} />
              <div className="project-copy">
                <p className="micro project-type"><span className="signal-dot" aria-hidden="true" />{t(`${project.id}.type`)}</p>
                <h3 id={project.id + '-title'}><bdi dir="ltr" lang="en">{project.name}</bdi></h3>
                <p className="project-summary">{t(`${project.id}.summary`)}</p>
                <div className="project-actions">
                  <ProjectDetails id={project.id + '-details'} name={project.name} label={t('details')} closeLabel={t('closeDetails')}>
                    <p className="project-role">{t(`${project.id}.role`)}</p>
                    <p className="project-description">{t(`${project.id}.description`)}</p>
                    <ul className="badges">
                      {project.technologies.map((tech) => <li key={tech}><bdi dir="ltr" lang="en">{tech}</bdi></li>)}
                    </ul>
                    <ul className="project-highlights">
                      {(t.raw(`${project.id}.highlights`) as string[]).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </ProjectDetails>
                  {project.url && (
                    <a href={project.url} className="text-link" target="_blank" rel="noopener noreferrer" aria-label={t('visit') + ' · ' + project.name}>
                      <span>{t('visit')}</span><ArrowUpRight className="directional" size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
