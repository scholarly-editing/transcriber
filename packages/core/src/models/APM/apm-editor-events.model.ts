import type { TranscriptionDocument } from './apm-document.model.ts'

export interface EditorEventListeners {
  /**
   * Fired when the user clicks "Save" in the toolbar.
   * The app should take the data and send it to the backend.
   */
  onSaveRequest: (data: TranscriptionDocument) => void

  /**
   * Fired when the user selects a specific historical version from the dropdown.
   * The app should fetch that version and call `loadDocument`.
   */
  onVersionRequest: (versionId: number, versionIndex: number) => void

  /**
   * Fired when the editor enters 'Edit Mode' (unlocked).
   */
  onEnable: () => void

  /**
   * Fired when the editor leaves 'Edit Mode' (locked).
   */
  onDisable: () => void

  /**
   * Fired whenever content changes (for auto-save or UI dirty-state indicators).
   */
  onContentChange: (isDirty: boolean) => void
}
