import { Project } from '../../projects';

export const mockProjects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with React frontend and .NET backend. Features product catalog, shopping cart, and payment integration.',
    techStack: ['React', 'TypeScript', 'C#', 'SQL Server', 'Stripe API'],
    details: 'Implemented a complete e-commerce solution with real-time inventory management, user authentication, and payment processing. Used Entity Framework Core for data access and Redux for state management.',
    githubUrl: 'https://github.com/sigge1511/ecommerce-platform',
  },
  {
    id: 'task-dashboard',
    title: 'Task Management Dashboard',
    description: 'Interactive dashboard for team task management with drag-and-drop functionality. Built with React and TypeScript.',
    techStack: ['React', 'TypeScript', 'CSS', 'Node.js', 'MongoDB'],
    details: 'A responsive dashboard with real-time updates, kanban-style task boards, and team collaboration features. Implemented WebSocket for live notifications.',
    githubUrl: 'https://github.com/sigge1511/task-dashboard',
  },
  {
    id: 'weather-app',
    title: 'Weather Application',
    description: 'Real-time weather application with location services and forecast data. Clean, minimal UI with dark theme.',
    techStack: ['React', 'TypeScript', 'API', 'CSS'],
    details: 'Fetches weather data from OpenWeather API, displays current conditions and 5-day forecast. Includes geolocation support and local storage for favorites.',
  },
  {
    id: 'dotnet-microservices',
    title: '.NET Microservices Architecture',
    description: 'Scalable microservices system built with .NET. Includes API gateway, authentication service, and database per service pattern.',
    techStack: ['C#', 'ASP.NET Core', 'Docker', 'Kubernetes', 'PostgreSQL'],
    details: 'Enterprise-grade microservices implementation with service discovery, circuit breaker pattern, and distributed logging using Serilog.',
    githubUrl: 'https://github.com/sigge1511/microservices',
  },
  {
    id: 'real-time-chat',
    title: 'Real-time Chat Application',
    description: 'Messaging platform with real-time synchronization. Features user authentication, direct messages, and group chats.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    details: 'Built with Socket.io for real-time communication. Implements JWT authentication, message encryption, and typing indicators.',
    githubUrl: 'https://github.com/sigge1511/realtime-chat',
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization Dashboard',
    description: 'Interactive charts and graphs dashboard for analytics. Displays real-time data with multiple visualization options.',
    techStack: ['React', 'TypeScript', 'D3.js', 'API'],
    details: 'Custom D3.js visualizations with responsive design. Includes filtering, drill-down capabilities, and export functionality.',
  },
  {
    id: 'cli-tool',
    title: 'Project Scaffolder CLI',
    description: 'Command-line tool for generating project boilerplate. Supports multiple project types and customizable templates.',
    techStack: ['Node.js', 'TypeScript', 'Commander.js'],
    details: 'NPM package providing interactive CLI for project setup. Includes template customization and git repository initialization.',
    githubUrl: 'https://github.com/sigge1511/project-scaffolder',
  },
];
