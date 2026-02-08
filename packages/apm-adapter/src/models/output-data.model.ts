import type { Note } from './note.model.ts'
import type { Operation } from './operation.model.ts'

export interface OutputData {
  /**
   * The structured content (text + formatting).
   * Must support custom attributes:
   * bold, italic, lang, deletion, addition, unclear, marginalmark,
   * linegap, chunkmark, chaptermark.
   */
  ops: Operation[]

  /**
   * Any new editorial notes created during the session.
   */
  newNotes: Note[]
}
