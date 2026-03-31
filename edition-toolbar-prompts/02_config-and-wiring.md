<task>
**Goal:** Add `toolbarEnabled` to the editor config model, wire the toolbar extension into the editor setup pipeline, and export it from the core package.

1. In `packages/core/src/core/models/config.model.ts`, add an optional boolean property to `IEditorConfig`:
   ```typescript
   toolbarEnabled?: boolean;
   ```
   Place it after `highlightingEnabled`.

2. In `packages/core/src/editor/editor-setup.ts`:
   - Import `createToolbarExtension` from `./extensions/toolbar-extension.ts`.
   - Inside `createConfiguredSetup(config)`, after the keymap block, add:
     ```typescript
     if (config.toolbarEnabled && config.editingEnabled) {
       extensions.push(createToolbarExtension(config));
     }
     ```
   - The toolbar only makes sense when editing is enabled (inserting symbols requires editability).

3. In `packages/core/src/index.ts`:
   - Add export for the toolbar extension factory:
     ```typescript
     export { createToolbarExtension } from './editor/extensions/toolbar-extension.ts';
     ```
   - Add export for the shared symbol actions (from step 1):
     ```typescript
     export { insertSymbol, wrapWithBrackets } from './editor/extensions/symbol-actions.ts';
     ```

4. In `apps/react-playground/src/stories/sample-data/configs.ts`:
   - Add `toolbarEnabled: true` to both `ARABIC_CONFIG` and `LATIN_CONFIG` so the toolbar is visible by default in the playground.

5. Verify the `TranscriptionManager.setConfig()` flow:
   - `setConfig` already calls `this.setupCompartment.reconfigure(createConfiguredSetup(config))`, so toggling `toolbarEnabled` at runtime will automatically add/remove the toolbar extension. **No changes needed** in `transcription-manager.ts`.
</task>

<inputs>
- `packages/core/src/core/models/config.model.ts` — `IEditorConfig` interface (lines ~79-90).
- `packages/core/src/editor/editor-setup.ts` — `createConfiguredSetup` function.
- `packages/core/src/index.ts` — barrel exports.
- `apps/react-playground/src/stories/sample-data/configs.ts` — `ARABIC_CONFIG`, `LATIN_CONFIG`.
- `packages/core/src/core/transcription-manager.ts` — `setConfig` method (read-only, verify no changes needed).
</inputs>

<constraints>
- `toolbarEnabled` must be optional (defaults to `undefined`/`false`) for backward compatibility — existing consumers who don't pass it should see no toolbar.
- Do not modify `config-adapter.ts` — `toolbarEnabled` is a pure UI concern, not sent to the WASM parser.
- Import order: types before values, alphabetical within groups (Biome enforced).
</constraints>

<deliverable>
- Modified: `packages/core/src/core/models/config.model.ts`
- Modified: `packages/core/src/editor/editor-setup.ts`
- Modified: `packages/core/src/index.ts`
- Modified: `apps/react-playground/src/stories/sample-data/configs.ts`
</deliverable>

<verification>
- `pnpm -r tsc --noEmit` passes across all packages.
- `pnpm check` (Biome lint + format) passes.
- In Storybook, the `StructuredDocument` story shows the toolbar on click. The `ReadOnly` story does not show the toolbar (editing disabled). Toggling `toolbarEnabled` off in `ConfigSwitching` at runtime hides the toolbar.
</verification>
