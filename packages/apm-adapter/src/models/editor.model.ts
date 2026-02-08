import type { TranscriptionDocument } from './document.model.ts';

export interface ITranscriptionEditor {
  /**
   * Lifecycle: Initialize the editor with content.
   * Corresponds to: setData(columnData)
   */
  loadDocument(data: TranscriptionDocument): void;

  /**
   * Lifecycle: Retrieve the current state of the document for saving.
   * Corresponds to: getData()
   */
  getDocument(): TranscriptionDocument;

  /**
   * State: Unlocks the editor for user input.
   * Corresponds to: enable()
   */
  enableEditing(): void;

  /**
   * State: Locks the editor (read-only mode).
   * Corresponds to: disable()
   */
  disableEditing(): void;

  /**
   * Action: Triggers the internal save workflow (locks UI, shows spinner).
   * Note: This does not actually write to DB; it emits an event requesting the app to save.
   * Corresponds to: save(versionInfo)
   */
  initiateSave(versionInfo?: any): void;

  /**
   * Callback: The app calls this when the backend save succeeded.
   * The editor should unlock and clear dirty flags.
   * Corresponds to: saveSuccess(newData)
   */
  handleSaveSuccess(newData: TranscriptionDocument): void;

  /**
   * Callback: The app calls this when the backend save failed.
   * The editor should unlock and show an error state.
   * Corresponds to: saveFail(reason)
   */
  handleSaveError(reason: string): void;

  /**
   * Action: Discard current changes and revert to last saved state.
   * Corresponds to: reset()
   */
  discardChanges(): void;

  /**
   * Display: Adjust the base font size.
   * Corresponds to: setFontSize(), makeTextBigger(), makeTextSmaller()
   */
  setZoomLevel(fontSize: number): void;

  /**
   * Display: Change the primary language context (Direction LTR/RTL, Fonts).
   * Corresponds to: setDefaultLang()
   */
  setPrimaryLanguage(langCode: string): void;
}
