export interface TranscriptionDocument {
  metadata: {
    pageId: number
    columnId: number
    mainLanguage: string // 'la'
    currentVersionId: number
    isLatestVersion: boolean
  }

  /** History for the version dropdown */
  versionHistory: Array<{
    id: number
    timestamp: string
    author: string
    description: string
    tags: ('minor' | 'review')[]
  }>

  /**
   * The content operations.
   * If replacing Quill, you might map this to a Prosemirror Node or a Slate Value,
   * but broadly it is a list of text segments + attributes.
   */
  content: Array<TranscriptionBlock>

  /** Editorial notes separate from text (optional, depending on architecture) */
  editorialNotes: Array<{
    id: number
    linkedItemId: number
    text: string
  }>
}

/**
 * Represents the specific "Blots" (Semantic Elements) found in the code
 */
export type TranscriptionBlock = {
  type: 'paragraph' | 'heading' | 'gloss' | 'linegap' | 'chunk' | 'chapter'
  text?: string
  attributes: {
    // Common
    bold?: boolean
    italic?: boolean
    lang?: string

    // Critical Apparatus
    unclear?: boolean
    deletion?: boolean
    addition?: boolean // Requires target
    substitution?: boolean // Requires target

    // Identifiers
    itemId?: number // Unique ID for this segment
    handId?: number // Which scribe wrote this

    // Structural
    lineGapCount?: number
    chunkReference?: string // e.g. "Book 1, Chapter 2"
    pageNumber?: string
  }
}
