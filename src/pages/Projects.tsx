import { useState } from "react";
import type { Project } from "../projects";
import { projects } from "../projects";
import "../styles/projects.css";
import "../styles/about.css";

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
  return (
    <article className={`project-card ${isExpanded ? "is-expanded" : ""}`}>
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-description">{project.description}</p>

      <div className="project-tech-list">
        {project.techStack.map((tech) => (
          <span key={tech} className="tech-tag">{tech}</span>
        ))}
      </div>

      <button
        className="card-toggle-btn"
        aria-expanded={isExpanded}
        aria-controls={`details-${project.id}`}
        onClick={onToggle}
      >
        {isExpanded ? "Hide details" : "Show details"}
        <span className="chevron" aria-hidden="true">&#9662;</span>
      </button>

      <div
        id={`details-${project.id}`}
        className="card-details"
        role="region"
        aria-label={`Details for ${project.title}`}
        aria-hidden={!isExpanded ? true : undefined}
      >
        <p>{project.details}</p>
      </div>
    </article>
  );
}

function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="projects-page">
      <div className="page-banner">
        <div className="page-banner-inner">
          <p className="page-banner-label">What I&apos;ve built</p>
          <h1 className="page-banner-title">Projects</h1>
        </div>
      </div>

      <div className="projects-content">
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedId === project.id}
              onToggle={() => handleToggle(project.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Projects;
