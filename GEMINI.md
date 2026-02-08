# muhaqqiq-editor

## Project Overview

`muhaqqiq-editor` is a monorepo containing the source code for a text editor project, likely specialized (given the name "Muhaqqiq"). It is structured as a **pnpm workspace**.

The project consists of:
*   **Core Logic:** A framework-agnostic core library based on [CodeMirror 6](https://codemirror.net/).
*   **React Integration:** A React wrapper for easy usage in React applications.
*   **Playground:** A React application for testing and development, including a Storybook setup.

## Project Structure

*   `apps/`
    *   `react-playground`: A demo/test application using React and Vite. It serves as a workbench for developing the editor components.
*   `packages/`
    *   `core` (`@muhaqqiq-editor/core`): The main logic of the editor. Depends on `codemirror`.
    *   `react` (`@muhaqqiq-editor/react`): React bindings for the core editor. Depends on `@muhaqqiq-editor/core`.

## Getting Started

### Prerequisites

*   **Node.js**: Required.
*   **pnpm**: This project uses `pnpm` for package management.

### Installation

Install dependencies from the root directory:

```bash
pnpm install
```

### Running the Playground

To start the development server for the React playground:

```bash
cd apps/react-playground
pnpm dev
```

The application will typically start at `http://localhost:5173`.

### Running Storybook

To start Storybook for UI component development:

```bash
cd apps/react-playground
pnpm storybook
```

Storybook usually runs at `http://localhost:6006`.

## Building

### Building Packages

You can build individual packages by navigating to their directory and running the build script.

**Core:**
```bash
cd packages/core
pnpm build
```

**React Package:**
```bash
cd packages/react
pnpm build
```

**Playground:**
```bash
cd apps/react-playground
pnpm build
```

## Development Conventions

*   **Monorepo Management:** Uses `pnpm` workspaces. Dependencies between local packages are managed via workspace protocols (e.g., `workspace:*`).
*   **Build Tool:** [Vite](https://vitejs.dev/) is used for building both the applications and the libraries.
*   **Language:** TypeScript is used throughout the project.
*   **Linting:** ESLint is configured for the React packages.
*   **Type Generation:** `vite-plugin-dts` is used to generate type definitions for the libraries.
