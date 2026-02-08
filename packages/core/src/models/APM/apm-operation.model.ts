// Inserted via `insertLineGap`
export interface LineGapData {
  editorid: number
  thelength: number // Number of missing lines
}

// Inserted via `genChunkButtonFunction`
export interface ChunkMarkData {
  editorid: number
  itemid: number
  text: string // The Work ID (DARE ID) e.g., "AW01"
  target: string // The Chunk Number e.g., "15"
  thelength: number // Segment number
  extrainfo: string // Local ID e.g., "A", "B"
  alttext: 'start' | 'end'
}

// Inserted via `genChapterMarkButtonFunction`
export interface ChapterMarkData {
  editorid: number
  itemid: number
  text: string // Combined Appellation + Title (tab separated in legacy code)
  target: string // Chapter Number
  thelength: number // Level (1-5)
  extrainfo: string // Work ID
  alttext: 'start' | 'end'
}

// Inserted via `genOnClickNoteButton`
export interface NoteMarkData {
  editorid: number
  itemid: number // Links to the `Note` interface defined above
}
export interface BlockAttributes {
  /**
   * Defines if the line is a special structural block.
   * If undefined, it is a normal paragraph.
   */
  header?: number // 1-6
  align?: 'left' | 'center' | 'right' | 'justify'
  direction?: 'rtl' | 'ltr'

  /** Marginal Gloss block */
  gloss?: {
    place: string // e.g., "left", "bottom"
    elementid: number // Groups multiple lines into one gloss
  }
}
export interface TextAttributes {
  // --- Visual Formatting ---
  bold?: boolean
  italic?: boolean
  superscript?: boolean

  // --- Language ---
  /** ISO code (e.g., 'la', 'grc') if different from default */
  lang?: string

  // --- Scribe Identification ---
  /** ID of the scribe hand (from options.hands) */
  handid?: number

  // --- Critical Apparatus (The "Items") ---
  // These usually carry an itemId to link to notes or other segments

  /** Text that has been deleted/struck through */
  deletion?: {
    itemid: number
    handid?: number
  }

  /** Text that is hard to read */
  unclear?: {
    itemid: number
    handid?: number
  }

  /** Text added in the margin/interlinearly */
  addition?: {
    itemid: number
    place: 'margin' | 'interlinear' | 'inline' // From 'place' attribute
    target?: number // The itemid of the text this addition modifies
  }

  /** Text substituted (corrected) */
  substitution?: {
    itemid: number
    target: number // The itemid of the text being replaced
  }

  /** General marginal mark */
  marginalmark?: {
    itemid: number
  }
}
export interface EmbedOperation {
  /**
   * The type of embed and its specific data.
   * In Quill this was a key-value pair like { linegap: { ... } },
   * but strictly typed here:
   */
  insert:
    | { linegap: LineGapData }
    | { chunkmark: ChunkMarkData }
    | { chaptermark: ChapterMarkData }
    | { mark: NoteMarkData } // The visual icon for a Note

  /** Attributes usually apply to the line containing the embed */
  attributes?: BlockAttributes
}
export interface TextOperation {
  /** The actual text string */
  insert: string

  /** Semantic and visual formatting applied to this text */
  attributes?: TextAttributes
}
export type Operation = TextOperation | EmbedOperation;