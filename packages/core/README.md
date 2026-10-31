# @scholarly-editing/transcriber-core

Framework-agnostic scholarly transcription editor built on CodeMirror 6. Provides a bidirectional pipeline between structured document models (`IDocument`) and flat editor text, with config-driven edition symbol handling.

## Quick Start

### Install

```bash
pnpm add @scholarly-editing/transcriber-core
```

### String Mode (simple)

Mount a plain-text CodeMirror editor with sensible defaults:

```typescript
import { mountEditor } from '@scholarly-editing/transcriber-core';

const editor = mountEditor({
  parent: document.getElementById('editor')!,
  doc: 'Initial content',
  onDocChange: (doc) => console.log('Changed:', doc),
});

editor.setDoc('Updated content');
editor.destroy();
```

### Document Mode (structured)

Use `TranscriptionManager` for full bidirectional sync between an `IDocument` and the editor:

```typescript
import { TranscriptionManager } from '@scholarly-editing/transcriber-core';
import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-core';

const manager = new TranscriptionManager({
  document: myDocument,
  config: myConfig,
  onChanges: (updatedDoc) => saveToBackend(updatedDoc),
});

manager.mount(document.getElementById('editor')!);

// Update programmatically
manager.setDocument(newDocument);
manager.setConfig(newConfig);

// Clean up
manager.destroy();
```

## API Overview

### High-Level: `TranscriptionManager`

The main orchestrator. Manages state, editor view, and the bidirectional `IDocument ↔ flat text` pipeline.

| Method | Description |
|--------|-------------|
| `mount(parent)` | Mount the editor into a DOM element |
| `destroy()` | Tear down the editor and release resources |
| `getDocument()` | Get the current `IDocument` |
| `setDocument(doc)` | Replace the document (re-syncs editor) |
| `setConfig(config)` | Update editor config (theme, editing, highlighting) |
| `getEditorText()` | Get raw flat text from the editor |
| `onChanges(cb)` | Subscribe to document changes |

### Low-Level: `mountEditor()`

Creates a bare CodeMirror `EditorView` with basic extensions (line numbers, history, keymaps, theme). Returns `{ view, getDoc, setDoc, destroy }`. Use this when you don't need structured document support.

### Extensions

Build custom extension bundles with these factory functions:

- `createConfiguredSetup(config)` — Full extension set driven by `IEditorConfig`
- `createEditorTheme(options?)` — Direction-aware light theme
- `createCleanupExtension(config)` — Input sanitization (strips invalid characters)
- `createHighlightExtension(config)` — Decorates edition symbols with CSS classes
- `createEditorKeymap(config)` — Keyboard shortcuts for inserting edition symbols

### Processors

The bidirectional pipeline functions, usable standalone:

- `documentToText(doc, config)` — `IDocument` → flat text string
- `textToDocument(text, doc, config)` — Flat text → updated `IDocument`
- `processLine(line, config)` — Parse a single line into tokens + states
- `textToLines(text, config)` — Parse flat text into `ILine[]`

### Utilities

- `formatToken(token, state, config)` / `parseTokenState(formatted, config)` — Token ↔ display text
- `charOffsetToLineToken(offset, doc)` / `lineTokenToCharOffset(line, token, doc)` — Position mapping
- `getStatistics(state)` — Cursor position, selection, line info from `EditorState`

## `IEditorConfig`

Drives all editor behavior — edition symbol parsing, keyboard shortcuts, highlighting, and theme.

```typescript
const config: IEditorConfig = {
  word: [
    {
      label: 'Arabic',
      charRange: [0x0600, 0x06FF],
      additionalChars: [0x0020],
      defaultState: 'normal',
    },
  ],
  prefix: [
    { symbol: '†', label: 'Corrupt' },
    { symbol: '?', label: 'Unclear' },
  ],
  suffix: [
    { symbol: '!', label: 'Sic' },
  ],
  brackets: [
    { open: '[', close: ']', label: 'Supplied' },
    { open: '[[', close: ']]', label: 'Editorial' },
    { open: '{', close: '}', label: 'Expansion' },
  ],
  dividers: [
    { symbol: '---', label: 'Section Break' },
  ],
  theme: {
    direction: 'rtl',
    textFont: 'Amiri',
    gutterFont: 'monospace',
    minFontSize: 12,
    maxFontSize: 36,
    lineNumbers: { margin: 40, fontFactor: 0.8 },
  },
  editingEnabled: true,
  highlightingEnabled: true,
};
```

## `IDocument`

The structured document model. Elements contain lines; lines contain tokens (raw words) and states (edition symbol classifications per token).

```typescript
const document: IDocument = {
  id: 'doc-1',
  text: [
    {
      id: 'elem-1',
      order: 0,
      position: '1r',
      lines: [
        {
          id: 'line-1',
          elementId: 'elem-1',
          order: 0,
          tokens: ['بسم', 'الله', 'الرحمن'],
          states: ['normal', 'normal', 'normal'],
        },
        {
          id: 'line-2',
          elementId: 'elem-1',
          order: 1,
          tokens: ['كتاب', 'في', 'النحو'],
          states: ['normal', 'normal', 'supplied'],
        },
      ],
    },
  ],
  dividers: [],
};
```

### Pipeline Example

```
IDocument → documentToText() → "بسم الله الرحمن\nكتاب في [النحو]"
                                      ↕ (user edits in CodeMirror)
flat text → textToDocument()  → IDocument (updated tokens/states)
```

## Exports

### Models & Types

`IDocument`, `IElement`, `ILine`, `IDivider`, `IEditorConfig`, `IWordConfig`, `IPrefixConfig`, `ISuffixConfig`, `IBracketsConfig`, `IDividerConfig`, `IThemeSettings`, `IThemeOverride`, `IEditorTheme`, `ITranscriptionEditorApi`, `ITranscriptionManagerOptions`, `MountEditorOptions`, `MountedEditor`, `Statistics`, `IStateListener`, `ITranscriptionState`

### Classes

`TranscriptionManager`, `StateManager`, `TranscriptionStateManager`

### Functions

`mountEditor`, `createConfiguredSetup`, `editorSetup`, `createEditorTheme`, `createCleanupExtension`, `createHighlightExtension`, `createEditorKeymap`, `documentToText`, `elementToText`, `textToDocument`, `textToLines`, `processLine`, `formatToken`, `formatTokens`, `formatLine`, `parseTokenState`, `charOffsetToLineToken`, `lineTokenToCharOffset`, `buildLineLengths`, `buildTokenLengths`, `getLineAtOffset`, `getStatistics`
