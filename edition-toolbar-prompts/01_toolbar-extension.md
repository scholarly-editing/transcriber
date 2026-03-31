<task>
**Goal:** Create a new CodeMirror 6 extension (`toolbar-extension.ts`) that provides a hovering toolbar with edition-symbol buttons, positioned at the cursor via the `showTooltip` facet.

1. Create `packages/core/src/editor/extensions/toolbar-extension.ts`.

2. Extract `insertSymbol` and `wrapWithBrackets` from `keymap-extension.ts` into a new shared file `packages/core/src/editor/extensions/symbol-actions.ts`, so both the keymap extension and the toolbar extension can reuse them. Update `keymap-extension.ts` to import from the shared file. Export from `packages/core/src/index.ts`.

3. Define a `StateEffect<boolean>` called `toggleToolbar` — `true` to show, `false` to hide.

4. Define a `StateField<Tooltip | null>` called `toolbarField`:
   - `create()` → `null` (toolbar hidden initially).
   - `update(value, tr)`:
     - If `tr.docChanged` → return `null` (hide toolbar when user types).
     - Check `tr.effects` for `toggleToolbar`:
       - If `toggleToolbar` with `true`: build a `Tooltip` object with `pos` set to `tr.state.selection.main.head`, `above: true`, `arrow: false`, and a `create(view)` method that returns the toolbar DOM.
       - If `toggleToolbar` with `false`: return `null`.
     - Otherwise return the previous value.
   - `provide: field => showTooltip.from(field)` — wires the field into the tooltip facet.

5. Implement the `create(view: EditorView) → TooltipView` function for the Tooltip:
   - Build a container `<div>` with class `muhaqqiq-toolbar`.
   - **Prefix buttons:** For each `config.prefix`, create a `<button>` with the symbol as text content, a `title` attribute with the label (e.g., "corrupt"), and class `muhaqqiq-toolbar-btn`. On click: call `insertSymbol(view, prefix.symbol)`, then dispatch `toggleToolbar.of(false)`.
   - **Suffix buttons:** Same pattern for `config.suffix`.
   - **Bracket buttons:** For each `config.brackets` (not skipped), create a `<button>` showing `open…close` as text (e.g., `[[ ]]`), `title` with the label. On click: call `wrapWithBrackets(view, bracket.open, bracket.close)`, then dispatch `toggleToolbar.of(false)`.
   - Group buttons visually: prefix group, suffix group, bracket group — separated by a thin `<span>` divider with class `muhaqqiq-toolbar-divider` (only between non-empty groups).
   - Return `{ dom: container }`.

6. Add a `mouseup` DOM event handler via `EditorView.domEventHandlers`:
   - On `mouseup`: if editing is enabled, dispatch `toggleToolbar.of(true)` after a 0ms `setTimeout` (ensures selection is settled). Return `false` (don't prevent default).
   - **Important:** The handler must check `view.state.facet(EditorView.editable)` to skip when editing is disabled.

7. Add a `baseTheme` for the toolbar:
   ```typescript
   const toolbarBaseTheme = EditorView.baseTheme({
     '.muhaqqiq-toolbar': {
       display: 'flex',
       gap: '2px',
       padding: '4px 6px',
       background: 'var(--muhaqqiq-toolbar-bg, #fff)',
       border: '1px solid var(--muhaqqiq-toolbar-border, #d0d7de)',
       borderRadius: '6px',
       boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
       zIndex: '10',
       flexWrap: 'wrap',
       maxWidth: '320px',
     },
     '.muhaqqiq-toolbar-btn': {
       padding: '2px 8px',
       border: '1px solid var(--muhaqqiq-toolbar-btn-border, #d0d7de)',
       borderRadius: '4px',
       background: 'var(--muhaqqiq-toolbar-btn-bg, #f6f8fa)',
       color: 'var(--muhaqqiq-toolbar-btn-color, #24292f)',
       cursor: 'pointer',
       fontSize: '14px',
       fontWeight: '600',
       lineHeight: '1.4',
       '&:hover': {
         background: 'var(--muhaqqiq-toolbar-btn-hover-bg, #e2e5e9)',
         borderColor: 'var(--muhaqqiq-toolbar-btn-hover-border, #afb8c1)',
       },
     },
     '.muhaqqiq-toolbar-divider': {
       width: '1px',
       alignSelf: 'stretch',
       background: 'var(--muhaqqiq-toolbar-divider-color, #d0d7de)',
       margin: '2px 4px',
     },
   });
   ```

8. Export a factory function `createToolbarExtension(config: IEditorConfig): Extension` that returns an array:
   `[toolbarField, mouseupHandler, toolbarBaseTheme]`.

9. Important implementation details:
   - The `config` is captured in the closure — the `create()` function reads prefix/suffix/brackets from it to build buttons dynamically.
   - Button `mousedown` events should call `e.preventDefault()` to prevent the editor from losing focus before the click handler fires.
   - After inserting a symbol and hiding the toolbar, re-focus the editor via `view.focus()`.
   - RTL-aware: the toolbar should work regardless of text direction since CodeMirror tooltips handle positioning.
</task>

<inputs>
- `packages/core/src/editor/extensions/keymap-extension.ts` — Contains `insertSymbol()` and `wrapWithBrackets()` to extract.
- `packages/core/src/core/models/config.model.ts` — `IEditorConfig`, `IPrefixConfig`, `ISuffixConfig`, `IBracketsConfig`.
- CodeMirror API: `StateField`, `StateEffect`, `showTooltip` (from `@codemirror/view`), `EditorView`, `Tooltip`, `TooltipView`.
- `packages/core/src/editor/extensions/highlight-extension.ts` — Reference for how other extensions are structured (StateField pattern, baseTheme).
</inputs>

<constraints>
- Follow the codebase style: explicit return types, `import type`, single quotes, semicolons, 2-space indent.
- Do not add `@codemirror/tooltip` as a dependency — `showTooltip` is exported from `@codemirror/view` (verify in the codebase's installed version).
- Button click handlers must prevent default on `mousedown` (not `click`) to keep editor focus.
- The extension must be self-contained: no React dependencies, no DOM IDs (only class-based selectors).
- CSS custom properties must be prefixed with `--muhaqqiq-toolbar-*`.
</constraints>

<deliverable>
- New file: `packages/core/src/editor/extensions/symbol-actions.ts` — extracted `insertSymbol` and `wrapWithBrackets`.
- Modified file: `packages/core/src/editor/extensions/keymap-extension.ts` — imports from `symbol-actions.ts`.
- New file: `packages/core/src/editor/extensions/toolbar-extension.ts` — complete toolbar extension.
</deliverable>

<verification>
- `cd packages/core && tsc --noEmit` passes with no errors.
- The toolbar extension can be instantiated: `createToolbarExtension(LATIN_CONFIG)` returns a valid Extension array.
- `insertSymbol` and `wrapWithBrackets` are importable from `symbol-actions.ts`.
- `keymap-extension.ts` still compiles and functions correctly after the refactor.
</verification>
