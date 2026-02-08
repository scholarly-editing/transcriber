# AGENTS.md - Coding Guidelines for Muhaqqiq Editor

## Repository Overview

Monorepo for Muhaqqiq Editor - a text editor project with TypeScript/React, using pnpm workspaces and Vite.

**Structure:**
- `packages/core` - Framework-agnostic editor core with CodeMirror 6
- `packages/react` - React wrapper component
- `packages/apm-adapter` - APM adapter models
- `apps/react-playground` - Demo app with Storybook

## Commands

### Development
```bash
# Root level
pnpm dev        # Run all packages in parallel
tsc --watch     # Watch mode in individual packages

# Apps
pnpm storybook  # Run Storybook (from react-playground)
pnpm preview    # Preview built app
```

### Build
```bash
# Root level
pnpm build      # Build all packages

# Individual packages
cd packages/core && pnpm build       # Core only
cd packages/react && pnpm build      # React wrapper
cd apps/react-playground && pnpm build  # Playground app
```

### Linting & Formatting
```bash
# Root level - all use Biome (not ESLint)
pnpm format              # Check formatting
pnpm format:write        # Fix formatting
pnpm lint                # Run linting
pnpm lint:fix            # Auto-fix lint issues
pnpm check               # Run both lint and format check
pnpm check:fix           # Auto-fix both lint and format
pnpm ci                  # CI mode (changes only)
```

### TypeScript
```bash
# Root level
pnpm -r tsc --noEmit    # Type check all packages

# Individual packages
cd packages/core && tsc --noEmit
cd packages/react && tsc -b  
cd apps/react-playground && tsc -b
```

### Testing
**No test framework is configured yet.** The test script currently exits with error.

## Code Style Guidelines

### TypeScript
- **Target:** ES2020
- **Module:** ESNext with type: "module" in package.json
- **Strict mode enabled**
- **Always use explicit types** for function return types and parameters
- **Interfaces over types** for object shapes (e.g., `interface EditorProps`)
- **Enums for fixed sets** of related constants

### Imports
- **Single quotes** for imports and strings (enforced by Biome)
- **Type imports** should use `import type { Interface }` or `import { type Interface }`
- **Semicolons** required (enforced by Biome)
- **No unused imports/variables** - Biome errors on these
- **Explicit file extensions**: Always include `.ts`, `.tsx`, `.js`, `.jsx` in imports

### React
- **Function components** with arrow functions: `export const Component: React.FC<Props> = () => {}`
- **Hooks** must be at top level (Biome rule: `useHookAtTopLevel`)
- **Type interfaces** for component props
- **Optional chaining** for callbacks: `onChange?.(value)`

### Code Formatting
- **2 spaces** indentation
- **100 character** line width
- **LF** line endings
- **Space** inside brackets: `{ key: value }`
- **Single quotes** only (except JSX attributes which use double quotes)
- **Trailing commas** ES5 style
- **Arrow parentheses** as needed: `x => x` but `(x, y) => x + y`
- **Semicolons** required
- **Interfaces/types** documented with JSDoc comments

### Error Handling
- **Return types** should include error unions where appropriate
- **Don't swallow errors** - log or propagate them appropriately
- **Graceful degradation** for UI components

### Naming Conventions
- **Interfaces:** PascalCase with `I` prefix (e.g., `ITranscriptionEditor`)
- **Types:** PascalCase (e.g., `TranscriptionDocument`)
- **Functions:** camelCase (e.g., `handleSaveSuccess`)
- **Constants:** UPPER_SNAKE_CASE
- **Props interfaces:** Component name + Props (e.g., `EditorProps`)
- **Hooks:** camelCase starting with "use" (e.g., `useState`)

### File Organization
- **One type/interface per file** when possible
- **Colocate related types** in `/models` directories
- **Export from index.ts** for clean imports
- **Feature-based folder structure** over type-based

### Git
- **Default branch:** master
- **Use .gitignore** for ignores
- **pnpm-lock.yaml** should be committed

### Performance & Security
- **No excessive cognitive complexity** (Biome warns > threshold)
- **Use const** over let (enforced by Biome)
- **Use template literals** over string concatenation (Biome warns)
- **No console.log** in packages (overridden to "off" in react-playground)
- **No array index keys** in React (Biome warns)

## Editor Extensions

- **Biome** for linting/formatting
- **TypeScript** for type checking
- **VS Code** workspace settings configured

## Vite Configuration
- **Build tool:** Vite for all packages
- **Type generation:** vite-plugin-dts for library types
- **Library mode:** UMD and ES builds configured
- **Development:** HMR available in playground
