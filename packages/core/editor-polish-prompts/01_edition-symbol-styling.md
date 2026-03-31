<task>
**Goal:** Make edition symbols (prefix, suffix, bracket characters) visually prominent with a distinct color that contrasts with both the default text color and the token state colors. Ensure the `.edition-symbol` CSS class is applying correctly to symbol characters in the split decoration ranges.

1. Verify and fix the edition symbol decoration behavior in `packages/core/src/editor/extensions/highlight-extension.ts`:

   a. The `addSplitDecorations` function splits a token span into symbol characters and word characters. Verify that:
      - The `indexOf(word)` lookup correctly finds the bare word within the formatted span text
      - Symbol characters before the word (prefixes like `*`, `†`, `?`, `!`) get the `edition-symbol` decoration
      - Symbol characters after the word (suffixes like `°`) get the `edition-symbol` decoration
      - Bracket characters around the word (`{`, `}`, `[`, `]`, `(`, `)`, `<`, `>`) get the `edition-symbol` decoration
      - There are no gaps or overlaps between symbol and word decoration ranges

   b. There is a subtle issue: in the Rust parser's output, the `word` field of a `WordToken` is the **bare word without any symbols** (e.g., for input `*كلمة`, `word` = `كلمة`, and the `span` covers the full `*كلمة`). The `state` field is `emendation`. The current `addSplitDecorations` uses `spanText.indexOf(word)` to find where the bare word sits within the span — this should work correctly for prefix symbols. Verify this works for:
      - Prefix: `*كلمة` → span covers `*كلمة`, word is `كلمة`, `*` should get `.edition-symbol`
      - Suffix: `كلمة°` → span covers `كلمة°`, word is `كلمة`, `°` should get `.edition-symbol`
      - Brackets: `{كلمة}` → span covers `{كلمة}`, word is `كلمة`, `{` and `}` should get `.edition-symbol`
      - Double brackets: `[[كلمة]]` → span covers `[[كلمة]]`, word is `كلمة`, `[[` and `]]` should get `.edition-symbol`

   c. Edge case: if the word itself contains characters that appear in the symbol set (unlikely but possible), `indexOf` should still work because word chars are from a different Unicode range than symbols.

2. Update the edition symbol CSS in `packages/core/src/style.css` to make symbols more visually distinct:

   ```css
   :root {
     /* Edition symbols — make them pop with a distinct teal/cyan color */
     --muhaqqiq-edition-symbol-color: #0550ae;
     --muhaqqiq-edition-symbol-opacity: 0.85;
   }

   .edition-symbol {
     color: var(--muhaqqiq-edition-symbol-color);
     opacity: var(--muhaqqiq-edition-symbol-opacity);
     font-weight: 700;
   }
   ```

   Key changes from current styling:
   - Color changed from `#6e7781` (neutral gray, hard to see) to `#0550ae` (strong blue, highly visible)
   - Added `font-weight: 700` (bold) to make symbols visually distinct from surrounding text
   - Added `opacity` custom property for fine-tuning

3. Ensure edition symbols inside bracket states render correctly. For a bracketed word like `{كلمة}` with state `editorial`:
   - `{` → `.edition-symbol` (bold blue)
   - `كلمة` → `.token-editorial` (whatever the editorial state color is)
   - `}` → `.edition-symbol` (bold blue)
   
   The bracket characters must NOT inherit the word's state class.

4. Add a new bracket state CSS rule if missing — `editorial`, `conjectural`, `gloss`, `superfluous`, `supplied` states may not have CSS classes yet. Check `style.css` and add any missing rules:
   ```css
   .token-editorial { color: var(--muhaqqiq-token-editorial-color, #8250df); }
   .token-conjectural { color: var(--muhaqqiq-token-conjectural-color, #bf8700); }
   .token-gloss { color: var(--muhaqqiq-token-gloss-color, #1a7f37); }
   .token-superfluous { color: var(--muhaqqiq-token-superfluous-color, #6e7781); text-decoration: line-through; }
   .token-supplied { color: var(--muhaqqiq-token-supplied-color, #0969da); font-style: italic; }
   .token-abbreviated { color: var(--muhaqqiq-token-abbreviated-color, #953800); }
   .token-lacuna { color: var(--muhaqqiq-token-lacuna-color, #953800); }
   ```
   Only add rules for states that don't already have a CSS class. The exact colors can be adjusted — the important thing is that each state has a distinct visual treatment.
</task>

<inputs>
- `packages/core/src/editor/extensions/highlight-extension.ts` — full file (see shared context)
- `packages/core/src/style.css` — full file (see shared context)
- `packages/core/src/parser/parser-types.ts` — `IWordToken` with `word`, `state`, `span` fields
- Sample configs from `apps/react-playground/src/stories/sample-data/configs.ts` — list of bracket/prefix/suffix definitions to know which states exist
</inputs>

<constraints>
- Do NOT change the highlight extension's decoration split algorithm unless there's a verified bug. The `addSplitDecorations` logic is structurally correct.
- Keep all existing CSS custom properties — only change their default values.
- New CSS rules must use custom properties (`--muhaqqiq-*`) so consumers can override colors.
- The `.edition-symbol` class must work in both LTR and RTL text.
- Do not add unnecessary CSS — only add classes for states that are actually used by the parser and configs.
</constraints>

<deliverable>
- Updated `packages/core/src/style.css` with prominent edition symbol styling and any missing token state classes
- Updated `packages/core/src/editor/extensions/highlight-extension.ts` only if a bug is found in the split decoration logic
</deliverable>

<verification>
- `pnpm build` succeeds
- `pnpm check` passes (Biome)
- In Storybook with ARABIC_CONFIG:
  - Type `*كلمة` → the `*` should render in bold blue (`.edition-symbol`), `كلمة` in emendation color
  - Type `{كلمة}` → `{` and `}` in bold blue, `كلمة` in editorial color
  - Type `†كلمة` → `†` in bold blue, `كلمة` in corrupt color
  - Type `كلمة°` → `كلمة` in abbreviated color, `°` in bold blue
  - Type `[[كلمة]]` → `[[` and `]]` in bold blue, `كلمة` in supplied color
  - Plain `كلمة` → no special decoration (`.token-sound`, inherits default color)
- Edition symbols are clearly distinguishable from surrounding text at a glance
</verification>
