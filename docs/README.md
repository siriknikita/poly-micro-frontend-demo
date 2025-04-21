# Poly Micro Manager - Frontend Documentation

This documentation provides detailed information about the features, components, and architecture of the Poly Micro Manager frontend application.

## Overview

The Poly Micro Manager is a comprehensive tool designed to manage microservices architecture. It provides features for:

- **Authentication**: User login and registration
- **Testing**: Automated testing of microservices
- **Monitoring**: Real-time monitoring of microservice health and performance
- **Pipelining**: CI/CD pipeline management for microservices
- **Shared Components**: Reusable UI components used across the application

## Component Structure

The application follows a modular architecture with components organized by feature and functionality:

```
src/components/
├── auth/            # Authentication components
├── layout/          # Layout components
│   ├── Sidebar.tsx  # Application sidebar navigation
│   ├── TopBar.tsx   # Application top navigation bar
│   └── ThemeToggle.tsx # Dark/light theme toggle
├── monitoring/      # Monitoring and observability components
│   ├── Dashboard.tsx # Main dashboard component
│   └── ... other monitoring components
├── pipelining/      # CI/CD pipeline management components
├── shared/          # Shared UI components
│   ├── selectors/   # Selection components
│   │   └── ProjectSelector.tsx # Project selection component
│   └── ... other shared components
├── testing/         # Automated testing components
└── index.ts         # Main export file for components
```

## Feature Documentation

Detailed documentation for each feature can be found in the following sections:

- [Authentication](./components/auth.md)
- [Monitoring](./components/monitoring.md)
- [Pipelining](./components/pipelining.md)
- [Shared Components](./components/shared.md)
- [Testing](./components/testing.md)
- [Core Components](./components/core.md)
- [Component Import Guide](./components/import-guide.md)

## Getting Started

To understand how these components work together, start with the [Core Components](./components/core.md) documentation, which explains the main application structure and navigation flow.

## Online Documentation

This documentation is also available online through GitHub Pages. For more information on accessing and using the online documentation, see [GitHub Pages Documentation](./github-pages.md).
