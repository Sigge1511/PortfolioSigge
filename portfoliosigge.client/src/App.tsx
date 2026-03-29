import { useState } from 'react';
import type { Project } from './projects'; // `import type` is erased at build time — TS uses it for type-checking only, like how C# generic constraints exist at compile time but not in IL.
import { projects } from './projects';
import './App.css';

// Props interface = the data contract for a component, like a C# ViewModel or a constructor's parameter object.
interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectCard({ project, isExpanded, onToggle }: ProjectCardProps) {
  return (
    <article
      className={`project-card ${isExpanded ? 'is-expanded' : ''}`}
    >
      <div className="project-card-header">
        <h3 className="project-card-title">{project.title}</h3>
      </div>
      <p className="project-card-description">{project.description}</p>
      <div className="project-card-tech">
        {/* `key` gives React a stable identity per element — like a primary key in EF Core change tracking. */}
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
        aria-hidden={!isExpanded}
      >
        <p>{project.details}</p>
      </div>
    </article>
  );
}

function App() {
  // useState returns [value, setter] — like a C# property with get/set that auto-triggers INotifyPropertyChanged so the UI re-renders.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
          {/* .map() is like LINQ .Select() + Razor @foreach — transform data into UI elements. */}
          {projects.map((p) => (
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
