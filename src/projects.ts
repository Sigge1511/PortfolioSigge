export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  details: string;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Developer Portfolio",
    description: "This portfolio site — built from scratch with React, TypeScript, and Vite.",
    techStack: ["React", "TypeScript", "Vite", "CSS"],
    details:
      "A fully hand-coded portfolio with no component libraries. Features client-side routing via React Router v7, a CSS design system with custom properties, responsive layouts, parallax hero, and accessible markup.",
  },
  {
    id: "weather-api",
    title: "Weather Dashboard API",
    description: "A RESTful API built with ASP.NET Core that aggregates weather data.",
    techStack: ["C#", ".NET", "ASP.NET Core", "Entity Framework"],
    details:
      "Backend API that fetches, caches, and serves weather data. Implements repository pattern, dependency injection, and Swagger documentation. Deployed on Azure App Service.",
  },
  {
    id: "task-tracker",
    title: "Task Tracker",
    description: "Real-time collaborative task management app built with React and SignalR.",
    techStack: ["React", "TypeScript", "SignalR", "C#"],
    details:
      "Full-stack app with a React frontend and an ASP.NET Core backend. Uses SignalR for real-time updates when tasks are created, updated, or completed by any connected user.",
  },
];
