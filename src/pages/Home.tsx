import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projects } from "../projects";
import "../styles/home.css";

function Home() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;
      const scrollY = window.scrollY;
      imgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const previewProjects = projects.slice(0, 3);

  return (
    <main>
      <section className="hero-banner" aria-label="Hero">
        <img
          ref={imgRef}
          src="/src/assets/hero.png"
          alt=""
          aria-hidden="true"
          className="hero-banner-img"
        />
        <div className="hero-banner-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Developer &amp; Student</p>
          <h1 className="hero-title">
            Hi, I&apos;m <span>Sigge</span>
          </h1>
          <p className="hero-subtitle">
            Building things with .NET, React, and TypeScript
          </p>
          <Link to="/projects" className="hero-cta">
            View My Projects
          </Link>
        </div>
      </section>

      <section className="home-intro" aria-labelledby="intro-heading">
        <div className="home-intro-grid">
          <div className="home-intro-text">
            <h2 id="intro-heading">Developer. Student. Builder.</h2>
            <p>
              I&apos;m a Swedish developer studying software engineering, working
              across the full stack with C#, .NET, React, and TypeScript.
              I love clean code, structured systems, and learning by doing.
            </p>
          </div>
          <div className="home-intro-stats">
            <div className="stat-card">
              <span className="stat-number">5+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">2+</span>
              <span className="stat-label">Years coding</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4</span>
              <span className="stat-label">Tech stacks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">&infin;</span>
              <span className="stat-label">Curiosity</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-preview" aria-labelledby="preview-heading">
        <p className="section-label">Selected work</p>
        <h2 id="preview-heading" className="section-heading">Recent Projects</h2>

        <div className="home-project-preview">
          {previewProjects.map((project) => (
            <div key={project.id} className="preview-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>

        <Link to="/projects" className="view-all-link">
          View All Projects &rarr;
        </Link>
      </section>
    </main>
  );
}

export default Home;
