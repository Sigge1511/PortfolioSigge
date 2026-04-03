import { useState } from 'react';
import { projects } from '../projects';
import '../styles/pages/projects.css';

function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="projects">
      <header className="projects__header">
        <div className="projects__header-inner">
          <p className="projects__page-label">Selected work</p>
          <h1 className="projects__headline">Projects</h1>
          <p className="projects__subheading">A collection of things I have built - from APIs to UIs.</p>
        </div>
      </header>
      <div className="projects__list" role="list">
        {projects.map((project, index) => {
          const isExpanded = expandedId === project.id;
          const detailsId = 'details-' + project.id;
          return (
            <article key={project.id} className={'project-item' + (isExpanded ? ' is-expanded' : '')} role="listitem">
              <span className="project-item__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="project-item__title">{project.title}</h2>
                <p className="project-item__desc">{project.description}</p>
                <div className="project-item__stack">
                  {project.techStack.map((tech) => <span key={tech} className="stack-tag">{tech}</span>)}
                </div>
                <div className="project-item__links">
                  <a href="https://github.com/sigge1511" target="_blank" rel="noopener noreferrer" className="project-item__link">GitHub</a>
                </div>
                <div className="project-item__details" id={detailsId} role="region" aria-hidden={!isExpanded}>{project.details}</div>
                <button className="project-item__toggle" onClick={() => toggle(project.id)} aria-expanded={isExpanded} aria-controls={detailsId}>
                  {isExpanded ? 'Close' : 'Details'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;