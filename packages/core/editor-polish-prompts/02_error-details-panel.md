<task>
**Goal:** Build a companion React component (`MuhaqqiqErrorPanel`) that displays a structured list of parser errors alongside the editor. Also expose the necessary error-subscription API from `TranscriptionManager` so the React component can receive live error updates.

This task has two parts:
1. **Core API** — expose parser diagnostic information from `TranscriptionManager`
2. **React component** — a new `MuhaqqiqErrorPanel` component in `packages/react/`

---

## Part 1: Core API — expose error diagnostics from TranscriptionManager

The current `TranscriptionManager` has `hasErrors(): boolean` which checks `state.errors.length > 0`. These `errors: string[]` are **pipeline errors** from the text→document conversion, NOT parser diagnostics.

The **parser diagnostic data** lives in the lint extension (`lint-extension.ts`) which runs its own `ParserService` internally. To surface parser errors to the React layer, we need to:

### 1a. Add a parser error event to TranscriptionManager

Add a method to `TranscriptionManager` that lets external consumers subscribe to parser diagnostics:

```typescript
// In packages/core/src/core/transcription-manager.ts

/** Parser diagnostic information exposed to consumers. */
export interface IParserDiagnostic {
  /** Start offset in the editor text */
  from: number;
  /** End offset in the editor text */
  to: number;
  /** Line number (1-based) */
  line: number;
  /** The error token text */
  token: string;
  /** Human-readable error message */
  message: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
}
```

Add a method `onDiagnosticsChange(callback: (diagnostics: IParserDiagnostic[]) => void): () => void` that fires whenever the editor text changes and parser diagnostics are recomputed.

Implementation approach — choose ONE of these strategies:

**Strategy A (recommended): Derive diagnostics from the lint extension's parser**
- Create a shared `ParserService` instance in `TranscriptionManager` that both the lint extension and the diagnostic subscription use
- After each `updateFromEditor`, run the parser and emit diagnostics
- The lint extension already does this work — we should avoid running the parser twice

**Strategy B: Extract diagnostics from the CodeMirror lint state**  
- After each editor update, read the CodeMirror lint diagnostics from the editor state using `diagnosticCount(state)` and `forEachDiagnostic(state, callback)` from `@codemirror/lint`
- Forward them as `IParserDiagnostic[]` to subscribers

Strategy A is cleaner since it doesn't depend on CodeMirror internals. The key requirement is: **don't create a second ParserService** — reuse the one that the lint extension uses, or make both share a single instance.

### 1b. Export the new types from core index

In `packages/core/src/index.ts`, export `IParserDiagnostic` and any new types.

### 1c. Re-export from React package

In `packages/react/src/index.ts`, re-export `IParserDiagnostic` from `@muhaqqiq-editor/core`.

---

## Part 2: React component — MuhaqqiqErrorPanel

Create `packages/react/src/ErrorPanel.tsx`:

```typescript
import type { IParserDiagnostic } from '@muhaqqiq-editor/core';
import type React from 'react';

export interface ErrorPanelProps {
  /** List of parser diagnostics to display */
  diagnostics: IParserDiagnostic[];
  /** Called when a diagnostic is clicked (for scroll-to-error) */
  onDiagnosticClick?: (diagnostic: IParserDiagnostic) => void;
  /** Optional CSS class for the root element */
  className?: string;
}
```

### Component design

The `MuhaqqiqErrorPanel` is a **controlled component** — it receives `diagnostics` as a prop. The parent is responsible for subscribing to the diagnostics stream and passing them down. This keeps the component pure and testable.

### Markup structure

```tsx
<div className={`muhaqqiq-error-panel ${className ?? ''}`}>
  <div className="muhaqqiq-error-panel__header">
    <span className="muhaqqiq-error-panel__count">
      {diagnostics.length} {diagnostics.length === 1 ? 'error' : 'errors'}
    </span>
  </div>
  {diagnostics.length === 0 ? (
    <div className="muhaqqiq-error-panel__empty">No errors</div>
  ) : (
    <ul className="muhaqqiq-error-panel__list">
      {diagnostics.map((d, i) => (
        <li
          key={`${d.from}-${d.to}-${i}`}
          className="muhaqqiq-error-panel__item"
          onClick={() => onDiagnosticClick?.(d)}
          role="button"
          tabIndex={0}
        >
          <span className="muhaqqiq-error-panel__severity" data-severity={d.severity} />
          <span className="muhaqqiq-error-panel__message">{d.message}</span>
          <span className="muhaqqiq-error-panel__location">Line {d.line}</span>
          <code className="muhaqqiq-error-panel__token">{d.token}</code>
        </li>
      ))}
    </ul>
  )}
</div>
```

### CSS for the error panel

Add styles in `packages/react/src/ErrorPanel.css` (imported by the component):

```css
.muhaqqiq-error-panel {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  border: 1px solid var(--muhaqqiq-panel-border-color, #d0d7de);
  border-radius: 6px;
  overflow: hidden;
}

.muhaqqiq-error-panel__header {
  padding: 8px 12px;
  background: var(--muhaqqiq-panel-header-bg, #f6f8fa);
  border-bottom: 1px solid var(--muhaqqiq-panel-border-color, #d0d7de);
  font-weight: 600;
}

.muhaqqiq-error-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.muhaqqiq-error-panel__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--muhaqqiq-panel-border-color, #d0d7de);
}

.muhaqqiq-error-panel__item:hover {
  background: var(--muhaqqiq-panel-hover-bg, #f3f4f6);
}

.muhaqqiq-error-panel__item:last-child {
  border-bottom: none;
}

.muhaqqiq-error-panel__severity[data-severity="error"]::before {
  content: '●';
  color: #cf222e;
}

.muhaqqiq-error-panel__severity[data-severity="warning"]::before {
  content: '●';
  color: #bf8700;
}

.muhaqqiq-error-panel__severity[data-severity="info"]::before {
  content: '●';
  color: #0969da;
}

.muhaqqiq-error-panel__message {
  flex: 1;
}

.muhaqqiq-error-panel__location {
  color: #656d76;
  font-size: 12px;
  white-space: nowrap;
}

.muhaqqiq-error-panel__token {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  background: #f6f8fa;
  padding: 1px 6px;
  border-radius: 3px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.muhaqqiq-error-panel__empty {
  padding: 16px 12px;
  text-align: center;
  color: #656d76;
}
```

### Export from React package

In `packages/react/src/index.ts`, add:
```typescript
export { MuhaqqiqErrorPanel } from './ErrorPanel.tsx';
export type { ErrorPanelProps } from './ErrorPanel.tsx';
```

---

## Part 3: Storybook story

Create or update `apps/react-playground/src/stories/Editor.stories.tsx` to add an `EditorWithErrorPanel` story that demonstrates the error panel alongside the editor:

```tsx
export const EditorWithErrorPanel: Story = {
  render: () => {
    const [diagnostics, setDiagnostics] = useState<IParserDiagnostic[]>([]);
    // Wire up diagnostics via TranscriptionManager.onDiagnosticsChange
    // Display MuhaqqiqEditor and MuhaqqiqErrorPanel side by side
  },
};
```

The story should:
- Use `ARABIC_DOCUMENT` and `ARABIC_CONFIG` from sample data
- Show the editor and error panel in a flex layout
- Demonstrate live error updates as text changes
- Show clicking an error (console.log the diagnostic for now)
</task>

<inputs>
- `packages/core/src/core/transcription-manager.ts` — full file (see shared context)
- `packages/core/src/core/models/editor-api.model.ts` — `IMuhaqqiqEditorApi` interface
- `packages/core/src/state/transcription-state.ts` — `ITranscriptionState` shape with `errors: string[]`
- `packages/core/src/editor/extensions/lint-extension.ts` — `createLintExtension()` and `formatErrorMessage()`
- `packages/core/src/parser/parser-types.ts` — `ITokenizerError`, `ITextError`, `IParserToken`
- `packages/core/src/parser/parser-service.ts` — `ParserService.tokenize()` returning `ITokenizeResult`
- `packages/react/src/Editor.tsx` — `MuhaqqiqEditor` component
- `packages/react/src/index.ts` — current exports
- `packages/core/src/index.ts` — current core exports
- `apps/react-playground/src/stories/Editor.stories.tsx` — existing stories
</inputs>

<constraints>
- The error panel must be a **controlled component** — it receives diagnostics as props, not from internal state. This makes it composable and testable.
- Do NOT create a second `ParserService` instance — reuse or share the one used by the lint extension.
- All CSS classes must be prefixed with `muhaqqiq-` to avoid collisions.
- All CSS must use custom properties with fallback values so consumers can theme it.
- Follow the project's conventions: function components with arrow syntax, `export const`, explicit types, single quotes, 2-space indentation.
- The `onDiagnosticClick` callback is for future scroll-to-error functionality — for now just expose it as a prop.
- Do NOT use React array index as the sole key — use `${d.from}-${d.to}-${i}` or similar.
- Keep the component lightweight — no state, no effects, just render from props.
- The `IParserDiagnostic` interface must be exported from `@muhaqqiq-editor/core` so both packages can use it.
</constraints>

<deliverable>
- `packages/core/src/core/transcription-manager.ts` — updated with `IParserDiagnostic` type and `onDiagnosticsChange()` subscription method
- `packages/core/src/core/models/editor-api.model.ts` — updated `IMuhaqqiqEditorApi` if needed
- `packages/core/src/index.ts` — export `IParserDiagnostic`
- `packages/react/src/ErrorPanel.tsx` — new `MuhaqqiqErrorPanel` component
- `packages/react/src/ErrorPanel.css` — styles for the error panel
- `packages/react/src/index.ts` — export `MuhaqqiqErrorPanel` and `ErrorPanelProps` and re-export `IParserDiagnostic`
- `apps/react-playground/src/stories/Editor.stories.tsx` — new `EditorWithErrorPanel` story
</deliverable>

<verification>
- `pnpm build` succeeds across all packages
- `pnpm check` passes (Biome)
- In Storybook:
  - The `EditorWithErrorPanel` story renders correctly
  - Type invalid text (e.g. mismatched brackets, unknown symbols) → errors appear in the panel
  - Fix the text → errors disappear from the panel
  - Click a diagnostic → `onDiagnosticClick` fires (console.log for now)
  - Panel shows "No errors" when text is valid
</verification>
