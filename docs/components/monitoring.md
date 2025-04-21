# Monitoring Feature Documentation

## Overview

The Monitoring feature provides real-time observability and performance tracking for microservices. It allows users to monitor service health, view logs, track resource usage, and receive alerts for potential issues.

## Components Structure

```
src/components/monitoring/
├── LogViewer/                 # Components for viewing and analyzing logs
│   └── [Log viewer components]
├── hooks/                     # Custom hooks for monitoring functionality
│   ├── useAuthManagement.ts   # Hook for managing authentication state
│   ├── useProjectManagement.ts # Hook for managing project selection
│   ├── useServiceSelection.ts # Hook for managing service selection
│   ├── useTabNavigation.ts    # Hook for managing tab navigation
│   └── index.ts               # Export file for hooks
├── shared/                    # Shared components used within monitoring
│   └── [Shared monitoring components]
├── CPUChart.tsx               # Component for displaying CPU usage charts
├── Dashboard.tsx              # Main application dashboard and layout component
├── MonitoringDashboard.tsx    # Main dashboard for monitoring features
├── ServiceStatus.tsx          # Component for displaying service health status
└── index.ts                   # Export file for monitoring components
```

## Key Components

### Dashboard.tsx

The main application dashboard component that serves as the container for all feature components. It handles navigation between different features and manages the overall application state. The component has been refactored to use custom hooks for better separation of concerns and maintainability.

**Key Features:**
- Tab-based navigation between features (Monitoring, Testing, CI/CD)
- Project selection and management
- User authentication state management
- Responsive layout with sidebar and topbar integration

**Custom Hooks:**
- `useTabNavigation`: Manages tab selection and URL synchronization
- `useProjectManagement`: Handles project selection, persistence, and context updates
- `useAuthManagement`: Manages user authentication state and service selection history
- `useServiceSelection`: Handles service selection within each feature

### MonitoringDashboard.tsx

The main container component for the monitoring feature. It integrates all monitoring components and provides a comprehensive view of microservice health and performance.

**Key Features:**
- Overview of all monitored services
- Real-time metrics visualization
- Alert notifications
- Service filtering and grouping

### CPUChart.tsx

Displays CPU usage metrics for microservices over time.

**Key Features:**
- Real-time CPU usage visualization
- Historical data comparison
- Threshold indicators
- Customizable time ranges

### ServiceStatus.tsx

Shows the current health status of microservices.

**Key Features:**
- Health indicators (healthy, warning, critical)
- Uptime information
- Response time metrics
- Quick access to service details

### LogViewer

A set of components for viewing and analyzing service logs.

**Key Features:**
- Real-time log streaming
- Log filtering and searching
- Log level visualization
- Error highlighting and analysis

## Data Flow

1. **Data Collection**: Metrics and logs are collected from microservices
2. **Processing**: Data is processed and analyzed for patterns and anomalies
3. **Visualization**: Processed data is displayed through various charts and tables
4. **Alerting**: Anomalies trigger alerts based on predefined thresholds

## Integration with Other Features

- **Testing**: Test results can be viewed in the monitoring dashboard
- **Pipelining**: Deployment status and pipeline health are monitored
- **Authentication**: User permissions determine which services can be monitored

## Usage Examples

### Monitoring Service Health

1. Navigate to the Monitoring section from the sidebar
2. View the service health overview in the MonitoringDashboard
3. Click on a specific service to see detailed metrics
4. Set up alerts for critical thresholds

### Analyzing Service Logs

1. Select a service from the monitoring dashboard
2. Navigate to the LogViewer section
3. Filter logs by level, timestamp, or content
4. Identify and analyze error patterns
5. Export logs for further analysis if needed

### Tracking Resource Usage

1. View the CPUChart component for CPU usage metrics
2. Monitor memory and network usage through respective charts
3. Identify resource bottlenecks and optimization opportunities
4. Compare resource usage across different services
