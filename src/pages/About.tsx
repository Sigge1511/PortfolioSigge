import '../styles/pages/about.css';

const interests = ['Politics', 'Geopolitics & conflicts', 'History of war', 'Music', 'Defense', 'Design', 'Typography', 'Dogs', 'Rare plants & gardening', 'Caffeine'];

function About() {
  return (
    <div className="about">
      <header className="about__header">
        <div className="about__header-inner">
          <p className="about__page-label">About me</p>
          <h1 className="about__headline">Get to know me</h1>
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
              <p>Hi - I am Sigge. A budding developer and fullstack .NET student based in Östersund, working mainly with .NET, but also constantly learning new stuff.</p>
                          <p>I started programming as a way to discover how things work – and why not when they don't. I'm a former journalist but early warning signs were always there,
                              like liking new software more than new interview subjects and being too excited when talking to the IT Support when there were big (or small) issues.
                              I'm not one of those kids that has been coding since I was young and I'm not a gamer, but I'm always dangerously curious, like figuring out the bigger picture and inherently interested in how things function.</p>
                          <p>This portfolio is both a project showcase in of itself and a living record of what I am learning, while in progress. Just like this page was built as my first ever React & TypeScript project ever.
                              I'm curious about working with agentic ai, my current favorite is Brady Gaster's Squad,
                              but I'm also really nerdy about cyber security and saftey in general - so we'll see how that works together.</p>
            </div>
          </div>
        </section>
        <div className="about__sections">
          <section aria-label="Background">
            <p className="about__section-label">Background</p>
            <h2 className="about__section-title">Where I am coming from</h2>
            <div className="about__section-body">
                          <p>I grew up on tiny little island off the west coast, then in 2010 I moved up north to be a journalist.
                              I stayed up here and now I'm once again diving into a new world after 15 years in journalism. </p>
            </div>
          </section>
          <section aria-label="How I work">
            <p className="about__section-label">Approach</p>
            <h2 className="about__section-title">How I work</h2>
            <div className="about__section-body">
              <p>I prefer to start by zooming out and seeing the bigger picture. Then I start creating my checklists with desired features, develop some mood boards and get cracking with architecture.</p>
            </div>
          </section>
          <section aria-label="Interests">
            <p className="about__section-label">The nerdiness</p>
            <h2 className="about__section-title">Interests</h2>
            <div className="about__section-body"> </div>
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