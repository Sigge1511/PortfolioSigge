import "../styles/about.css";

function About() {
  return (
    <main className="about-page">
      <div className="page-banner">
        <div className="page-banner-inner">
          <p className="page-banner-label">Get to know me</p>
          <h1 className="page-banner-title">About Me</h1>
        </div>
      </div>

      <div className="about-content">
        <div className="about-grid">
          <article className="about-bio">
            <h2>Developer &amp; student based in Sweden</h2>

            <p>
              I&apos;m Sigge, a software engineering student building things across the full stack.
              My journey started with C# and .NET &mdash; backend APIs, database design, and learning
              how well-structured systems work under the hood. Over time I discovered that I enjoy
              the frontend just as much, especially when the two halves connect cleanly.
            </p>

            <p>
              Today I work with React and TypeScript on the frontend and ASP.NET Core on the
              backend. I care about writing code that&apos;s readable and maintainable &mdash; code that
              someone else (or future-me) can understand without a manual.
            </p>

            <p>
              When I&apos;m not coding I&apos;m reading about software architecture, tinkering with side
              projects, or figuring out how to make the next one better than the last.
            </p>

            <h2>Why this portfolio?</h2>
            <p>
              This site is itself a project. Built from scratch with React, TypeScript, and Vite &mdash;
              no component libraries, no shortcuts. Every line of CSS was written by hand.
            </p>
          </article>

          <aside className="about-sidebar">
            <div className="about-sidebar-card">
              <h3>Currently studying</h3>
              <p>Software Engineering &mdash; full-stack focus</p>
            </div>

            <div className="about-sidebar-card">
              <h3>Currently building</h3>
              <ul>
                <li>This portfolio</li>
                <li>Weather Dashboard API (.NET)</li>
                <li>Task Tracker (React + SignalR)</li>
              </ul>
            </div>

            <div className="about-sidebar-card">
              <h3>Interested in</h3>
              <ul>
                <li>Clean architecture</li>
                <li>Developer tooling</li>
                <li>Frontend performance</li>
                <li>Azure &amp; cloud deployment</li>
              </ul>
            </div>

            <div className="about-sidebar-card">
              <h3>Based in</h3>
              <p>Sweden</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default About;
