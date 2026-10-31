import { type Extension, StateEffect, StateField } from '@codemirror/state';
import { EditorView, showTooltip, type Tooltip, type TooltipView } from '@codemirror/view';
import type { IEditorConfig } from '../../core/models/config.model.ts';
import { insertSymbol, wrapWithBrackets } from './symbol-actions.ts';

// ---------------------------------------------------------------------------
// Effects
// ---------------------------------------------------------------------------

const toggleToolbar = StateEffect.define<boolean>();

// ---------------------------------------------------------------------------
// Toolbar DOM builder
// ---------------------------------------------------------------------------

function dismissToolbar(view: EditorView): void {
  view.dispatch({ effects: toggleToolbar.of(false) });
  view.focus();
}

function makeButton(label: string, title: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'sed-toolbar-btn';
  btn.textContent = label;
  btn.title = title;
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', onClick);
  return btn;
}

function createToolbarView(view: EditorView, config: IEditorConfig): TooltipView {
  const container = document.createElement('div');
  container.className = 'sed-toolbar';

  const groups: HTMLElement[][] = [];

  // Prefix buttons
  const prefixButtons = (config.prefix ?? []).map(p =>
    makeButton(p.symbol, p.label, () => {
      insertSymbol(view, p.symbol);
      dismissToolbar(view);
    })
  );
  if (prefixButtons.length > 0) groups.push(prefixButtons);

  // Suffix buttons
  const suffixButtons = (config.suffix ?? []).map(s =>
    makeButton(s.symbol, s.label, () => {
      insertSymbol(view, s.symbol);
      dismissToolbar(view);
    })
  );
  if (suffixButtons.length > 0) groups.push(suffixButtons);

  // Bracket buttons
  const bracketButtons = (config.brackets ?? [])
    .filter(b => !b.skip)
    .map(b =>
      makeButton(`${b.open}\u2009\u2026\u2009${b.close}`, b.label, () => {
        wrapWithBrackets(view, b.open, b.close);
        dismissToolbar(view);
      })
    );
  if (bracketButtons.length > 0) groups.push(bracketButtons);

  // Assemble groups with dividers between them
  for (let i = 0; i < groups.length; i++) {
    if (i > 0) {
      const divider = document.createElement('span');
      divider.className = 'sed-toolbar-divider';
      container.appendChild(divider);
    }
    for (const btn of groups[i]) {
      container.appendChild(btn);
    }
  }

  return { dom: container };
}

// ---------------------------------------------------------------------------
// StateField
// ---------------------------------------------------------------------------

function createToolbarField(config: IEditorConfig): StateField<Tooltip | null> {
  return StateField.define<Tooltip | null>({
    create() {
      return null;
    },

    update(value, tr) {
      if (tr.docChanged) return null;

      for (const effect of tr.effects) {
        if (effect.is(toggleToolbar)) {
          if (effect.value) {
            const pos = tr.state.selection.main.head;
            return {
              pos,
              above: true,
              arrow: false,
              create: (view: EditorView) => createToolbarView(view, config),
            };
          }
          return null;
        }
      }

      return value;
    },

    provide: field => showTooltip.from(field),
  });
}

// ---------------------------------------------------------------------------
// Mouse handler
// ---------------------------------------------------------------------------

function createMouseupHandler(): Extension {
  return EditorView.domEventHandlers({
    mouseup: (_, view) => {
      if (!view.state.facet(EditorView.editable)) return false;
      setTimeout(() => {
        view.dispatch({ effects: toggleToolbar.of(true) });
      }, 0);
      return false;
    },
  });
}

// ---------------------------------------------------------------------------
// Base theme
// ---------------------------------------------------------------------------

const toolbarBaseTheme = EditorView.baseTheme({
  '.sed-toolbar': {
    display: 'flex',
    gap: '2px',
    padding: '4px 6px',
    background: 'var(--sed-toolbar-bg, #fff)',
    border: '1px solid var(--sed-toolbar-border, #d0d7de)',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    zIndex: '10',
    flexWrap: 'wrap',
    maxWidth: '320px',
  },
  '.sed-toolbar-btn': {
    padding: '2px 8px',
    border: '1px solid var(--sed-toolbar-btn-border, #d0d7de)',
    borderRadius: '4px',
    background: 'var(--sed-toolbar-btn-bg, #f6f8fa)',
    color: 'var(--sed-toolbar-btn-color, #24292f)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.4',
    '&:hover': {
      background: 'var(--sed-toolbar-btn-hover-bg, #e2e5e9)',
      borderColor: 'var(--sed-toolbar-btn-hover-border, #afb8c1)',
    },
  },
  '.sed-toolbar-divider': {
    width: '1px',
    alignSelf: 'stretch',
    background: 'var(--sed-toolbar-divider-color, #d0d7de)',
    margin: '2px 4px',
  },
});

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Creates a hovering toolbar extension that displays edition-symbol buttons
 * at the cursor position when the user clicks inside the editor.
 *
 * @param config - Editor configuration with prefix/suffix/bracket definitions
 * @returns CodeMirror extension array
 */
export function createToolbarExtension(config: IEditorConfig): Extension {
  return [createToolbarField(config), createMouseupHandler(), toolbarBaseTheme];
}
