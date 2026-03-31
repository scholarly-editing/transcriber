import type { IEditorConfig } from '../core/models/config.model.ts';
import type { IParserDiagnostic } from '../core/models/diagnostic.model.ts';
import type { IDocument } from '../core/models/document.model.ts';
import { formatErrorMessage } from '../editor/extensions/lint-extension.ts';
import { ParserService } from '../parser/index.ts';
import type { ITokenizerError } from '../parser/parser-types.ts';
import { textToDocumentWithParser } from '../processors/line-processor.ts';
import { documentToText } from '../processors/text-data-processor.ts';
import { type IStateListener, StateManager } from './state-manager.ts';

/** Full state shape for the transcription editor. */
export interface ITranscriptionState {
  document: IDocument;
  config: IEditorConfig;
  editorText: string;
  isDirty: boolean;
  errors: string[];
  diagnostics: IParserDiagnostic[];
}

/**
 * Domain-specific state manager for the transcription editor.
 *
 * Wraps `StateManager<ITranscriptionState>` via composition, exposing
 * only the methods that make sense for transcription consumers. Handles
 * the bidirectional pipeline: IDocument ↔ flat editor text.
 */
export class TranscriptionStateManager {
  private stateManager: StateManager<ITranscriptionState>;
  private parser: ParserService;

  constructor(doc: IDocument, config: IEditorConfig) {
    const editorText = documentToText(doc, config);
    this.parser = new ParserService(config);
    this.stateManager = new StateManager<ITranscriptionState>({
      document: doc,
      config,
      editorText,
      isDirty: false,
      errors: [],
      diagnostics: [],
    });
  }

  /** Returns the full transcription state snapshot. */
  getState(): ITranscriptionState {
    return this.stateManager.getState();
  }

  /** Returns the current IDocument. */
  getDocument(): IDocument {
    return this.stateManager.getState().document;
  }

  /** Returns the current flat editor text. */
  getEditorText(): string {
    return this.stateManager.getState().editorText;
  }

  /**
   * Replaces the document, recomputes editor text, and resets dirty flag.
   * Clears any previous errors.
   */
  setDocument(doc: IDocument): void {
    const { config } = this.stateManager.getState();
    const editorText = documentToText(doc, config);
    const diagnostics = this.computeDiagnostics(editorText);
    this.stateManager.setState(() => ({
      document: doc,
      editorText,
      isDirty: false,
      errors: [],
      diagnostics,
    }));
  }

  /**
   * Updates the config and recomputes editor text from the current document.
   * Clears any previous errors.
   */
  setConfig(config: IEditorConfig): void {
    const { document: doc } = this.stateManager.getState();
    const editorText = documentToText(doc, config);
    this.parser.setConfig(config);
    const diagnostics = this.computeDiagnostics(editorText);
    this.stateManager.setState(() => ({
      config,
      editorText,
      errors: [],
      diagnostics,
    }));
  }

  /**
   * Called when the editor text changes (e.g. user typing).
   *
   * Parses the text back into an IDocument. On success, updates both
   * `document` and `editorText`; on failure, stores the error and
   * leaves the document unchanged.
   */
  updateFromEditor(text: string): void {
    const { document: currentDoc, config, editorText: previousText } = this.stateManager.getState();

    if (text === previousText) return;

    const diagnostics = this.computeDiagnostics(text);

    try {
      const newDoc = textToDocumentWithParser(text, currentDoc, config, this.parser);
      this.stateManager.setState(() => ({
        document: newDoc,
        editorText: text,
        isDirty: true,
        errors: [],
        diagnostics,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.stateManager.setState(current => ({
        editorText: text,
        isDirty: true,
        errors: [...current.errors, message],
        diagnostics,
      }));
    }
  }

  /**
   * Subscribes to document-only changes. The callback fires only when the
   * document reference changes (not on unrelated state updates).
   * Returns an unsubscribe function.
   */
  onDocumentChange(callback: (doc: IDocument) => void): () => void {
    let previousDoc = this.stateManager.getState().document;
    return this.stateManager.subscribe(state => {
      if (state.document !== previousDoc) {
        previousDoc = state.document;
        callback(state.document);
      }
    });
  }

  /** Registers a listener for all state changes. Returns an unsubscribe function. */
  subscribe(listener: IStateListener<ITranscriptionState>): () => void {
    return this.stateManager.subscribe(listener);
  }

  /**
   * Subscribes to diagnostics-only changes. The callback fires only when the
   * diagnostics array reference changes.
   * Returns an unsubscribe function.
   */
  onDiagnosticsChange(callback: (diagnostics: IParserDiagnostic[]) => void): () => void {
    let previousDiagnostics = this.stateManager.getState().diagnostics;
    return this.stateManager.subscribe(state => {
      if (state.diagnostics !== previousDiagnostics) {
        previousDiagnostics = state.diagnostics;
        callback(state.diagnostics);
      }
    });
  }

  /** Clears all subscriptions. */
  destroy(): void {
    this.stateManager.destroy();
  }

  /**
   * Tokenizes the text and extracts error tokens as IParserDiagnostic[],
   * reusing the existing ParserService instance.
   */
  private computeDiagnostics(text: string): IParserDiagnostic[] {
    const result = this.parser.tokenize(text);
    const diagnostics: IParserDiagnostic[] = [];

    for (const token of result.tokens) {
      if ('Error' in token) {
        const errorToken = (token as { Error: ITokenizerError }).Error;
        diagnostics.push({
          from: errorToken.span[0],
          to: errorToken.span[1],
          line: errorToken.line,
          token: errorToken.token,
          message: formatErrorMessage(errorToken.error),
          severity: 'error',
        });
      }
    }

    return diagnostics;
  }
}
