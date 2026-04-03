export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  details: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Developer Portfolio',
    description: 'This portfolio site - built with React, TypeScript, and Vite. Clean dark theme with a focus on typography and accessibility.',
    techStack: ['React', 'TypeScript', 'Vite', 'CSS'],
    details: 'A fully custom portfolio with React Router v6, no component library, and a design system built from CSS custom properties. Mobile-first, accessible, and fast.',
  },
  {
    id: 'dotnet-api',
    title: '.NET REST API',
    description: 'A RESTful API built with ASP.NET Core and Entity Framework Core. Clean architecture with repository pattern.',
    techStack: ['C#', 'ASP.NET Core', 'Entity Framework', 'SQL Server'],
    details: 'Implements clean architecture with separation of concerns. Uses EF Core for data access with code-first migrations, and JWT for authentication.',
  },
  {
    id: 'todo-app',
    title: 'Task Manager',
    description: 'Full-stack task management app with a .NET backend and React frontend. CRUD operations with filtering and sorting.',
    techStack: ['React', 'TypeScript', 'C#', 'SQLite'],
    details: 'Features a drag-and-drop interface, local persistence, and a .NET backend with SQLite. Deployed to Azure.',
  },
];