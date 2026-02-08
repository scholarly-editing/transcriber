export interface Note {
  /**
   * The unique ID of the note itself.
   * If negative (e.g., -100), it represents a new, unsaved note created in this session.
   * If positive, it is an existing note from the database.
   */
  id: number

  /**
   * The ID of the text segment (`itemId` in attributes) this note is attached to.
   * This links the note to a specific mark/highlight in the text.
   */
  linkedItemId: number

  /**
   * The content of the editorial note.
   */
  text: string

  /**
   * (Optional) The ID of the editor who wrote this note.
   * Derived from `this.options.editorTid`.
   */
  authorId?: number
}
