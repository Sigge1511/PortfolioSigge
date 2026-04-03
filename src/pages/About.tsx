import '../styles/pages/about.css';

const interests = ['Music', 'Design', 'Typography', 'Open Source', 'Video Games', 'Photography', 'Architecture', 'Coffee'];

function About() {
  return (
    <div className="about">
      <header className="about__header">
        <div className="about__header-inner">
          <p className="about__page-label">Get to know me</p>
          <h1 className="about__headline">About Me</h1>
        </div>
      </header>
      <div className="about__content">
        <section className="about__profile" aria-label="Profile">
          <div className="about__photo-container">
            <div className="about__photo-placeholder" role="img" aria-label="Profile photo">
              <span>Photo</span>
              <span>coming soon</span>
            </div>
          </div>
          <div className="about__bio">
            <div className="about__bio-text">
              <p>Hi - I am Sigge. A developer and student based in Sweden, working through the full stack with .NET, C#, React, and TypeScript.</p>
              <p>I started programming as a way to build things - and I still think that is the best reason.</p>
              <p>This portfolio is both a project showcase and a living record of what I am learning.</p>
            </div>
          </div>
        </section>
        <div className="about__sections">
          <section aria-label="Background">
            <p className="about__section-label">Background</p>
            <h2 className="about__section-title">Where I am coming from</h2>
            <div className="about__section-body">
              <p>I grew up in Sweden and picked up programming through curiosity. My first language was C#.</p>
            </div>
          </section>
          <section aria-label="How I work">
            <p className="about__section-label">Approach</p>
            <h2 className="about__section-title">How I work</h2>
            <div className="about__section-body">
              <p>I prefer clear over clever. Meaningful names, small functions, comments only where needed.</p>
            </div>
          </section>
          <section aria-label="Interests">
            <p className="about__section-label">Outside code</p>
            <h2 className="about__section-title">Interests</h2>
            <div className="about__section-body">
              <p>Music, design, and anything with good typography.</p>
            </div>
            <div className="about__interests" role="list">
              {interests.map((i) => <span key={i} className="about__interest-tag" role="listitem">{i}</span>)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;