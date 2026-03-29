// TypeScript interfaces are structural and compile-time only, unlike C# interfaces which are nominal contracts enforced by the runtime type system.
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  details: string;
}

// `export` makes this value available to other modules, similar to how `public` exposes members across assemblies/namespaces in C#.
export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Portfolio Site",
    description: "This very site — a responsive developer portfolio built from scratch.",
    techStack: ["React", "TypeScript", "CSS Grid", "Vite"],
    details:
      "My first React project. Uses CSS variables for theming, CSS Grid for the project gallery, and TypeScript for type-safe data handling. Dark mode switches automatically based on system preference. The click-to-reveal cards use CSS transitions with a class toggle — no animation libraries needed.",
  },
  {
    id: "weather-api",
    title: "Weather Dashboard API",
    description: "A .NET Web API serving weather data with a React frontend.",
    techStack: [".NET 9", "C#", "REST API", "Entity Framework"],
    details:
      "Built a RESTful API using ASP.NET Core minimal APIs. Implements repository pattern with Entity Framework Core for data access. Features include CRUD operations for weather stations, forecast retrieval with caching, and Swagger documentation. Deployed via Azure App Service.",
  },
  {
    id: "task-tracker",
    title: "Task Tracker",
    description: "A full-stack to-do app with authentication and real-time updates.",
    techStack: ["React", "TypeScript", "SignalR", ".NET 9"],
    details:
      "Full-stack application using React for the frontend and ASP.NET Core for the backend. Real-time task updates via SignalR WebSockets. JWT-based authentication with refresh token rotation. State management using React context and useReducer for predictable state transitions.",
  },
  {
    id: "cli-quiz",
    title: "C# Quiz CLI",
    description: "A command-line quiz game written in C# for learning programming concepts.",
    techStack: ["C#", ".NET Console", "JSON", "Unit Testing"],
    details:
      "Console application that loads quiz questions from JSON files and presents them interactively. Tracks scores and maintains a leaderboard. Uses dependency injection for testability — quiz logic is fully unit tested with xUnit. Demonstrates SOLID principles in a small project.",
  },
  {
    id: "recipe-book",
    title: "Recipe Book",
    description: "A recipe search and save app with filtering by ingredients.",
    techStack: ["React", "TypeScript", "CSS Flexbox", "LocalStorage"],
    details:
      "Client-side React app that fetches recipes from a public API and lets users save favorites to localStorage. Features debounced search, ingredient-based filtering, and responsive card layout. TypeScript interfaces model the API response shape — similar to how C# DTOs map JSON payloads.",
  },
];
