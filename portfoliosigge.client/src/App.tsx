import { useState } from 'react';
import type { Project } from './projects'; // Type-only imports are erased from emitted JavaScript, similar to how C# `using` brings interface/type names into scope without generating runtime code.
import { projects } from './projects';
import './App.css';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
  return (
    <article
      className={`project-card ${isExpanded ? 'is-expanded' : ''}`} // This conditional className uses the same ternary pattern you'd use in C# (for example in Blazor component attributes).
    >
      <div className="project-card-header">
        <h3 className="project-card-title">{project.title}</h3>
      </div>
      <p className="project-card-description">{project.description}</p>
      <div className="project-card-tech">
        {project.techStack.map((tech) => (
          <span key={tech} className="badge">
            {tech}
          </span>
        ))}
      </div>
      <button
        className="card-toggle"
        aria-expanded={isExpanded}
        aria-controls={`details-${project.id}`}
        onClick={onToggle}
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
        <span className="chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      <div
        id={`details-${project.id}`}
        className="card-details"
        role="region"
        aria-label={`Details for ${project.title}`}
      >
        <p>{project.details}</p>
      </div>
    </article>
  );
}

function App() {
  const [expandedId, setExpandedId] = useState<string | null>(null); // React state here is like a C# property with get/set plus INotifyPropertyChanged-style UI refresh behavior handled by React.

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }; // This handler mirrors a common C# event delegate pattern: receive an identifier, then route state changes through one focused method.

  return (
    <div className="portfolio">
      <nav className="nav" aria-label="Main navigation">
        <span className="nav-logo">Sigge</span>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <header className="hero" aria-label="Introduction">
        <h1>
          Hi, I'm <span className="accent">Sigge</span>
        </h1>
        <p className="hero-subtitle">
          Developer & student — building things with .NET, React, and TypeScript
        </p>
        <a href="#projects" className="cta">
          View Projects
        </a>
      </header>

      <section id="projects" className="projects-section" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-title">
          Projects
        </h2>
        <div className="project-grid">
          {projects.map(
            (
              p, // `.map()` in React is analogous to C# LINQ `.Select()` followed by Razor `@foreach` rendering each projected item.
            ) => (
              <ProjectCard
                key={p.id}
                project={p}
                isExpanded={expandedId === p.id}
                onToggle={() => handleToggle(p.id)}
              />
            ),
          )}
        </div>
      </section>

      <section id="about" className="about-section" aria-label="About">
        <h2 className="section-title">About Me</h2>
        <p>
          I'm a developer and student based in Sweden, working with .NET, C#, React, and
          TypeScript. I enjoy building clean, well-structured applications — from REST APIs to
          interactive web UIs. This portfolio is both a project showcase and a learning journey
          documented in code.
        </p>
      </section>

      <footer className="footer">
        <p>
          © 2025 Sigge · Built with React & TypeScript ·{' '}
          <a
            href="https://github.com/Sigge1511/PortfolioSigge"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
