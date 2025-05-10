# Poly Micro Manager - Frontend Demo

This repository contains the frontend demo for the Poly Micro Manager project, a comprehensive tool designed to manage microservices architecture.

## Features

- **Authentication**: User login and registration
- **Testing**: Automated testing of microservices with AI assistance
- **Monitoring**: Real-time monitoring of microservice health and performance
- **Pipelining**: CI/CD pipeline management for microservices

## Design Patterns and Architecture

The project follows modern React best practices and design patterns:

### 🏛️ Architecture Principles
- **SOLID Principles**: Each component has a single responsibility, is open for extension but closed for modification
- **Feature-Based Organization**: Code organized by feature rather than by type
- **Custom Hooks Pattern**: Logic extracted into reusable hooks
- **Component Composition**: Complex UIs built through component composition

### 🧩 Key Patterns
- **Custom Hooks**: For state management, side effects, and feature-specific logic
- **Context API**: For global state management
- **Atomic Design**: UI components organized following atomic design principles
- **TypeScript**: Strong typing throughout the application

See our [complete patterns documentation](./docs/architecture/patterns.md) for more details.

## Project Structure

The application follows a modular architecture with components organized by feature and functionality:

```
src/
├── App.tsx                # Main application component
├── __tests__/             # Test files for components and hooks
│   ├── auth/              # Tests for authentication components and hooks
│   ├── testing/           # Tests for testing feature components and hooks
│   └── ... other test files
├── components/            # UI components organized by feature
│   ├── auth/              # Authentication components
│   │   ├── components/    # Reusable auth UI components
│   │   ├── hooks/        # Auth-specific hooks
│   │   └── index.ts      # Export file for auth components
│   ├── layout/            # Layout components
│   ├── monitoring/        # Monitoring and observability components
│   ├── pipelining/        # CI/CD pipeline management components
│   ├── shared/            # Shared UI components
│   ├── testing/           # Automated testing components
│   │   ├── components/    # Reusable testing UI components
│   │   ├── hooks/        # Testing-specific hooks
│   │   ├── constants.ts  # Testing constants
│   │   └── index.ts      # Export file for testing components
│   └── index.ts           # Main export file for components
├── context/               # React context providers
├── hooks/                 # Application-wide custom hooks
├── types/                 # TypeScript type definitions
└── ... other configuration files
```

## Documentation

Detailed documentation for each feature can be found in the `docs/` directory:

- [Main Documentation](./docs/README.md)
- [User Guide](./docs/user-guide.md)
- [Component Documentation](./docs/components/)
- [Implementation Details](./docs/implementation/)
- [Architecture Patterns](./docs/architecture/patterns.md)
- [For Developers](./docs/for-developers/README.md)

You can also access the documentation online using the following [link](https://siriknikita.github.io/poly-micro-frontend-demo/#/)!

## Recent Updates

- Refactored testing components with custom hooks and reusable UI components
- Added comprehensive test suite for auth components and hooks
- Improved monitoring dashboard with better service status visualization
- Enhanced CI/CD pipeline management with visual pipeline builder
- Updated documentation with user guidance for new features
- Added detailed architecture patterns documentation
