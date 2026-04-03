import "../styles/skills.css";

interface SkillCategory {
  label: string;
  skills: string[];
  highlight?: string[];
}

const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["C#", "TypeScript", "JavaScript", "HTML", "CSS", "SQL"],
    highlight: ["C#", "TypeScript"],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["React", ".NET / ASP.NET Core", "Entity Framework Core", "SignalR", "xUnit"],
    highlight: ["React", ".NET / ASP.NET Core"],
  },
  {
    label: "Tools & Platforms",
    skills: ["Git", "GitHub", "Vite", "Visual Studio", "VS Code", "Swagger / OpenAPI"],
    highlight: ["Git"],
  },
  {
    label: "Currently Learning",
    skills: ["Azure", "Docker", "CI/CD (GitHub Actions)", "PostgreSQL", "Testing patterns"],
  },
];

function Skills() {
  return (
    <main className="skills-page">
      <div className="page-banner">
        <div className="page-banner-inner">
          <p className="page-banner-label">What I work with</p>
          <h1 className="page-banner-title">Skills</h1>
        </div>
      </div>

      <div className="skills-content">
        <div className="skills-grid">
          {skillCategories.map((category) => (
            <div key={category.label} className="skill-category">
              <p className="skill-category-label">{category.label}</p>
              <div className="skill-tags">
                {category.skills.map((skill) => {
                  const isHighlighted = category.highlight?.includes(skill) ?? false;
                  return (
                    <span
                      key={skill}
                      className={`skill-tag ${isHighlighted ? "highlight" : ""}`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="skills-learning">
          <h3>Always learning</h3>
          <p>
            I believe in growing continuously. My current focus is cloud deployment with Azure,
            containerisation with Docker, and building reliable CI/CD pipelines.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Skills;
