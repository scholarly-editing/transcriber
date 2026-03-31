<task>
**Goal:** Add Storybook stories that demonstrate the hovering toolbar feature, including a runtime toggle for `toolbarEnabled`, and verify the toolbar's show/hide/insert behavior.

1. In `apps/react-playground/src/stories/Editor.stories.tsx`, update the `ConfigSwitchingExample` component:
   - Add a `toolbarEnabled` state variable (default `true`).
   - Add a checkbox to toggle it, matching the style of the existing checkboxes.
   - Include `toolbarEnabled` in the `config` object passed to `MuhaqqiqEditor`.
   - This allows runtime verification: toggling the checkbox adds/removes the toolbar.

2. Add a new story `ToolbarShowcase`:
   - Create a component that renders `MuhaqqiqEditor` in document mode with `LATIN_CONFIG` (which has `toolbarEnabled: true` from step 2).
   - Use the `EDITION_SYMBOLS_DOC` document (already defined in the file) so all edition symbol states are represented.
   - Add a short instruction text above the editor: "Click inside the editor to see the edition-symbol toolbar. Click a button to insert, or start typing to dismiss."
   - Include a `DocumentJsonViewer` below the editor to show the live document output.

3. Verify expected toolbar behavior in Storybook:
   - **Show:** Click inside the editor text → toolbar appears above the cursor with buttons for all configured prefix, suffix, and bracket symbols.
   - **Insert prefix:** Click a prefix button (e.g., `†`) → the symbol is inserted at the cursor position, toolbar hides.
   - **Wrap brackets:** Select text, click → toolbar appears. Click a bracket button (e.g., `[[ ]]`) → selection is wrapped, toolbar hides.
   - **Hide on type:** Click to show toolbar, then type a character → toolbar disappears.
   - **Disabled:** In `ConfigSwitching`, uncheck "Editing enabled" or uncheck the new "Toolbar" checkbox → toolbar no longer appears on click.

4. In `apps/react-playground/src/stories/EditorWithJsonPreview.tsx`:
   - No changes should be needed — the component already passes `config` through to `MuhaqqiqEditor`, which passes it to `TranscriptionManager`. Verify this is the case. If `EditorWithJsonPreview` does not forward `config.toolbarEnabled`, update accordingly.
</task>

<inputs>
- `apps/react-playground/src/stories/Editor.stories.tsx` — existing stories (ConfigSwitchingExample, EDITION_SYMBOLS_DOC).
- `apps/react-playground/src/stories/EditorWithJsonPreview.tsx` — wrapper component.
- `apps/react-playground/src/stories/sample-data/configs.ts` — `ARABIC_CONFIG`, `LATIN_CONFIG` (now with `toolbarEnabled: true`).
- `packages/react/src/Editor.tsx` — `MuhaqqiqEditor` component (passes config to TranscriptionManager).
</inputs>

<constraints>
- Follow existing story patterns: use `render: () => <Component />` format.
- Use existing imports — do not add new dependencies to the playground.
- Instruction text should be a simple `<p>` element, not a Storybook doc block.
- Keep JSDoc comments on story exports for Storybook autodocs.
</constraints>

<deliverable>
- Modified: `apps/react-playground/src/stories/Editor.stories.tsx` (updated `ConfigSwitchingExample`, new `ToolbarShowcase` story).
- Possibly modified: `apps/react-playground/src/stories/EditorWithJsonPreview.tsx` (only if config forwarding needs fixing).
</deliverable>

<verification>
- `cd apps/react-playground && tsc -b` passes.
- `pnpm check` passes.
- `pnpm storybook` (from `apps/react-playground`) launches without errors.
- The `ToolbarShowcase` story renders and shows the toolbar on click.
- The `ConfigSwitching` story has a "Toolbar" checkbox that toggles toolbar visibility at runtime.
- The `ReadOnly` story does **not** show the toolbar (editing is disabled).
</verification>
