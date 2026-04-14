import { ProjectCardProps } from './types';

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article 
      className="project-card" 
      data-testid={`project-card-${project.id}`}
      role="article"
    >
      <div className="project-card__header">
        <span 
          className="project-card__index" 
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="project-card__title">{project.title}</h3>
      </div>
      
      <p className="project-card__description">{project.description}</p>
      
      <div className="project-card__stack" role="list" aria-label="Technology stack">
        {project.techStack.map((tech) => (
          <span 
            key={tech} 
            className="project-card__tag"
            role="listitem"
            data-testid={`tag-${tech.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {tech}
          </span>
        ))}
      </div>
      
      {project.githubUrl && (
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="project-card__link"
          aria-label={`GitHub repository for ${project.title}`}
        >
          View on GitHub
        </a>
      )}
    </article>
  );
}
