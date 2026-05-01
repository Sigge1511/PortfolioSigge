import '../styles/pages/skills.css';

interface Skill { name: string; level: number; }
interface SkillCategory { title: string; type: 'bars' | 'tags'; skills: Skill[] | string[]; }

const skillCategories: SkillCategory[] = [
    { title: 'Frontend', type: 'bars', skills: [{ name: 'React', level: 10 }, { name: 'ASP.NET CORE', level: 60 }, { name: 'TypeScript', level: 20 }, { name: 'CSS / HTML', level: 70 }, { name: 'XAML', level: 60 }, { name: 'Vite', level: 5 }] as Skill[] },
    { title: 'Backend', type: 'bars', skills: [{ name: 'C# / .NET', level: 78 }, { name: 'ASP.NET Core', level: 75 }, { name: 'Entity Framework Core', level: 60 }, { name: 'REST APIs', level: 80 }, { name: 'TSQL & Linq', level: 60 }, { name: 'Context Driven AI', level: 45 }] as Skill[] },
    { title: 'Tools', type: 'bars', skills: [{ name: 'Git / GitHub', level: 75 }, { name: 'VS Code', level: 43 }, { name: 'Visual Studio', level: 75 }, { name: 'Docker', level: 60 }, { name: 'Claude & Copilot', level: 50 }, { name: 'SSMS', level: 60 }] as Skill[] },
  { title: 'What I want to learn and improve next', type: 'tags', skills: ['CI/CD', 'New AI agents', 'Flutter/Bash', 'React', 'Open Source', 'Zero Trust', 'Cloud/Azure', 'NIS2', 'Zero Day', 'TypeScript'] },
];

function Skills() {
  return (
    <div className="skills">
      <header className="skills__header">
        <div className="skills__header-inner">
          <p className="skills__page-label">Technical profile</p>
          <h1 className="skills__headline">Skills</h1>
          <p className="skills__subheading">An honest snapshot of where I am at - and where I am headed.</p>
        </div>
      </header>
      <div className="skills__content">
        {skillCategories.map((category) => (
          <section key={category.title} className="skill-category">
            <h2 className="skill-category__title">{category.title}</h2>
            {category.type === 'bars' ? (
              <ul className="skill-bar-list">
                {(category.skills as Skill[]).map((skill) => (
                  <li key={skill.name} className="skill-bar">
                    <span className="skill-bar__name">{skill.name}</span>
                    <div className="skill-bar__track" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}>
                      <div className="skill-bar__fill" style={{ width: skill.level + '%' }} />
                    </div>
                    <span className="skill-bar__pct" aria-hidden="true">{skill.level}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="skill-tag-grid" role="list">
                {(category.skills as string[]).map((skill) => <span key={skill} className="skill-tag" role="listitem">{skill}</span>)}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default Skills;