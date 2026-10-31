import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { createConfiguredSetup } from '../editor/editor-setup.ts';
import { createEditorTheme } from '../editor/editor-theme.ts';
import { TranscriptionStateManager } from '../state/transcription-state.ts';
import type { IEditorConfig, IEditorTheme, IThemeSettings, IParserDiagnostic, IDocument, IMuhaqqiqEditorApi } from './models';

export interface ITranscriptionManagerOptions {
  document: IDocument;
  config: IEditorConfig;
  onChanges?: (data: IDocument) => void;
}

function isThemeSettings(theme: IEditorTheme): theme is IThemeSettings {
  return typeof (theme as IThemeSettings).direction === 'string';
}

function buildThemeExtension(config: IEditorConfig): Extension {
  const theme = config.theme;
  if (isThemeSettings(theme)) {
    return createEditorTheme({
      direction: theme.direction,
      lineFont: theme.textFont,
      gutterFont: theme.gutterFont,
    });
  }
  return EditorView.theme(theme as Record<string, Record<string, string>>, { dark: false });
}

/**
 * Main orchestrator for the transcription editor.
 *
 * Wires together state management (TranscriptionStateManager), the
 * bidirectional IDocument ↔ flat-text pipeline, and a CodeMirror 6
 * editor view. Consumers use this as the single high-level entry point.
 */
export class TranscriptionManager implements IMuhaqqiqEditorApi {
  initialData: IDocument;
  initialConfig: IEditorConfig;

  private stateManager: TranscriptionStateManager;
  private view: EditorView | null = null;
  private unsubscribeChanges: (() => void) | null = null;
  private unsubscribeDiagnostics: (() => void) | null = null;
  private updatingFromState = false;

  private setupCompartment = new Compartment();
  private themeCompartment = new Compartment();
  private editableCompartment = new Compartment();

  constructor(options: ITranscriptionManagerOptions) {
    this.initialData = options.document;
    this.initialConfig = options.config;
    this.stateManager = new TranscriptionStateManager(options.document, options.config);

    if (options.onChanges) {
      this.onChanges(options.onChanges);
    }
  }

  hasErrors(): boolean {
    return this.stateManager.getState().errors.length > 0;
  }

  setDocument(data: IDocument): void {
    this.stateManager.setDocument(data);
    this.syncEditorFromState();
  }

  setConfig(config: IEditorConfig): void {
    this.stateManager.setConfig(config);

    if (this.view) {
      this.view.dispatch({
        effects: [
          this.setupCompartment.reconfigure(createConfiguredSetup(config)),
          this.themeCompartment.reconfigure(buildThemeExtension(config)),
          this.editableCompartment.reconfigure(EditorView.editable.of(config.editingEnabled)),
        ],
      });
      this.syncEditorFromState();
    }
  }

  onChanges(callback: (data: IDocument) => void): void {
    if (this.unsubscribeChanges) {
      this.unsubscribeChanges();
    }
    this.unsubscribeChanges = this.stateManager.onDocumentChange(callback);
  }

  /**
   * Subscribes to parser diagnostic changes. The callback fires whenever
   * the diagnostics array is recomputed (on every text change).
   * Returns an unsubscribe function. Only one subscriber at a time is supported;
   * calling again replaces the previous subscription.
   */
  onDiagnosticsChange(callback: (diagnostics: IParserDiagnostic[]) => void): () => void {
    if (this.unsubscribeDiagnostics) {
      this.unsubscribeDiagnostics();
    }
    this.unsubscribeDiagnostics = this.stateManager.onDiagnosticsChange(callback);
    return () => {
      if (this.unsubscribeDiagnostics) {
        this.unsubscribeDiagnostics();
        this.unsubscribeDiagnostics = null;
      }
    };
  }

  /** Mounts the CodeMirror editor into the given DOM element. Idempotent. */
  mount(parent: HTMLElement): void {
    if (this.view) return;

    const config = this.stateManager.getState().config;
    const doc = this.stateManager.getEditorText();

    const extensions: Extension[] = [
      this.setupCompartment.of(createConfiguredSetup(config)),
      this.themeCompartment.of(buildThemeExtension(config)),
      this.editableCompartment.of(EditorView.editable.of(config.editingEnabled)),
      EditorView.updateListener.of(update => {
        try {
          if (update.docChanged && !this.updatingFromState) {
            const text = update.state.doc.toString();
            this.stateManager.updateFromEditor(text);
          }
        } catch (err) {
          console.error('[MuhaqqiqEditor] update listener error:', err);
        }
      }),
    ];

    const state = EditorState.create({ doc, extensions });
    this.view = new EditorView({ state, parent });
  }

  /** Destroys the editor view without clearing subscriptions. Idempotent. */
  unmount(): void {
    if (!this.view) return;
    this.view.destroy();
    this.view = null;
  }

  getDocument(): IDocument {
    return this.stateManager.getDocument();
  }

  getEditorText(): string {
    return this.stateManager.getEditorText();
  }

  /** Unmounts the editor and tears down all subscriptions. */
  destroy(): void {
    this.unmount();
    if (this.unsubscribeChanges) {
      this.unsubscribeChanges();
      this.unsubscribeChanges = null;
    }
    if (this.unsubscribeDiagnostics) {
      this.unsubscribeDiagnostics();
      this.unsubscribeDiagnostics = null;
    }
    this.stateManager.destroy();
  }

  private syncEditorFromState(): void {
    if (!this.view) return;
    const newText = this.stateManager.getEditorText();
    const currentText = this.view.state.doc.toString();
    if (newText === currentText) return;

    this.updatingFromState = true;
    try {
      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: newText },
      });
    } finally {
      this.updatingFromState = false;
    }
  }
}
