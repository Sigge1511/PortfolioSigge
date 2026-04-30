import * as React from 'react';
// ProjectList has a default export in the ProjectList folder; adjust import
import ProjectList from '../components/ProjectList/index';
import { projects } from '../projects.js';
import '../styles/pages/projects.css';

function Projects() {
  return (
    <div className="projects">
      <header className="projects__header">
        <div className="projects__header-inner">
          <p className="projects__page-label">Selected work</p>
          <h1 className="projects__headline">Projects</h1>
          <p className="projects__subheading">This page is yet to be built. Until then I recommend visiting my Github, found under the Contact page.</p>
          <p className="projects__subheading">A collection of things I have built - from APIs to UIs.</p>
        </div>
      </header>
      <div className="projects__content">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}

export default Projects;