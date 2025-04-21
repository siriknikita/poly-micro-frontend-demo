# Component Import Guide

## Overview

This guide explains how to properly import components in the Poly Micro Manager application, particularly focusing on components that have been renamed to avoid naming conflicts.

## Component Export Structure

The application uses a centralized export system through the main `src/components/index.ts` file. This file re-exports components from various feature modules, making them available through a single import path.

```typescript
// Import from the main components index
import { ComponentName } from '@/components';
```

## Renamed Components

Some components have been renamed in the main export file to avoid naming conflicts between different feature modules. The most notable examples are the `IconButton` components from the testing and pipelining features.

### IconButton Components

We have two different `IconButton` implementations:

1. **TestingIconButton**: The `IconButton` from the testing module
2. **PipeliningIconButton**: The `IconButton` from the pipelining module

#### How to Import

```typescript
// Import renamed components
import { TestingIconButton, PipeliningIconButton } from '@/components';

// Usage example
<TestingIconButton icon="play" onClick={handlePlay} />
<PipeliningIconButton icon="settings" onClick={handleSettings} />
```

#### Direct Imports

If you're working directly within a feature module, you can still import the original component with its original name:

```typescript
// Within testing feature components
import { IconButton } from '../components/IconButton';
// or
import { IconButton } from './components';

// Within pipelining feature components
import { IconButton } from '../components/IconButton';
// or
import { IconButton } from './components';
```

## Best Practices

1. **Use the renamed components** when importing from the main components index
2. **Use the original component names** when working within the specific feature module
3. **Be consistent** with your import patterns throughout your components
4. **Check the component source** if you're unsure which version you need

## Component Documentation

For detailed documentation on specific components, refer to the feature-specific documentation:

- [Testing Components](./testing.md)
- [Pipelining Components](./pipelining.md)
