import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import '../styles/pages/home.css';

function Home() {
  return (
    <div className="home">
      <HeroBanner
        label="Developer &amp; Creator"
        title="Welcome to my place"
        subtitle="Building clean software with .NET and React, with C#, CSS, TypeScript, HTML, XAML and more."
        primaryCta={{ label: 'View Projects', to: '/projects' }}
        secondaryCta={{ label: 'About Me', to: '/about' }}
      />
      <section className="home__intro" aria-label="Introduction">
        <div className="home__intro-inner">
          <div>
            <p className="home__intro-label">Who I am</p>
            <p className="home__intro-text">
              I am a <strong>developer and student</strong> based in Sweden,
              focused on building clean, well-structured applications - and getting serious boosts from AI.
            </p>
          </div>
          <div>
            <p className="home__intro-label">What I do</p>
            <p className="home__intro-text">
              Full-stack development with a focus on <strong>.NET</strong> and{' '}
              <strong>React</strong>. I care about code quality, saftey and sleek design.
            </p>
          </div>
        </div>
      </section>
      <section className="home__stats" aria-label="At a glance">
        <div className="home__stats-inner">
          <div className="home__stat"><p className="home__stat-number">5+</p><p className="home__stat-label">Projects</p></div>
          <div className="home__stat"><p className="home__stat-number">3</p><p className="home__stat-label">Languages</p></div>
          <div className="home__stat"><p className="home__stat-number">2+</p><p className="home__stat-label">Years coding</p></div>
          <div className="home__stat"><p className="home__stat-number">infinity</p><p className="home__stat-label">Caffeine consumed</p></div>
        </div>
      </section>
      <section className="home__ctas-section" aria-label="Explore">
        <nav aria-label="Page shortcuts">
          {[
            { label: 'Projects', to: '/projects' },
            { label: 'Skills',   to: '/skills' },
            { label: 'About Me', to: '/about' },
            { label: 'Contact',  to: '/contact' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} className="home__cta-item">
              <span className="home__cta-title">{label}</span>
              <span className="home__cta-arrow" aria-hidden="true">&#8594;</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}

export default Home;