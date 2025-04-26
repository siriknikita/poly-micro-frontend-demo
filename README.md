# Poly Micro Manager - Frontend Demo

This repository contains the frontend demo for the Poly Micro Manager project, a comprehensive tool designed to manage microservices architecture.

## Features

- **Authentication**: User login and registration
- **Testing**: Automated testing of microservices with AI assistance
- **Monitoring**: Real-time monitoring of microservice health and performance
- **Pipelining**: CI/CD pipeline management for microservices

## Project Structure

The application follows a modular architecture with components organized by feature and functionality:

```
src/
├── App.tsx                # Main application component
├── __tests__/             # Test files for components and hooks
├── components/            # UI components organized by feature
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── monitoring/        # Monitoring and observability components
│   ├── pipelining/        # CI/CD pipeline management components
│   ├── shared/            # Shared UI components
│   ├── testing/           # Automated testing components
│   └── index.ts           # Main export file for components
├── context/               # React context providers
├── hooks/                 # Application-wide custom hooks
├── types/                 # TypeScript type definitions
└── ... other configuration files
```

## Documentation

Detailed documentation for each feature can be found in the `docs/` directory:

- [Main Documentation](./docs/README.md)
- [Component Documentation](./docs/components/)

## Recent Updates

- Refactored testing components with custom hooks and reusable UI components
- Improved monitoring dashboard with better service status visualization
- Enhanced CI/CD pipeline management with visual pipeline builder
