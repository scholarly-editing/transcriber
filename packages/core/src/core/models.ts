/**
 * Core type definitions and interfaces for the transcription tool
 *
 * These types are framework-agnostic and represent the domain models
 * for text transcription, segmentation, and page editing.
 */

// ============================================================================
// Base GraphQL-like DTOs (Data Transfer Objects)
// ============================================================================

/**
 * Base DTO structure with typename for type identification
 */
export interface BaseDto {
  __typename: string;
  version?: number | null;
}

/**
 * Page data transfer object
 */
export interface PageDto extends BaseDto {
  __typename: 'PageDto';
  id: string;
  mediumId: string;
  number: number;
  image?: string | null;
  images?: Array<ImageDto | null> | null;
  text?: Array<TextElementDto | null> | null;
  segments?: Array<SegmentDto | null> | null;
  openSegments?: Array<SegmentDto | null> | null;
  endingSegments?: Array<SegmentDto | null> | null;
  commentary?: Array<string | null> | null;
  tags?: Array<string | null> | null;
  foliation?: string | null;
  pagination?: number | null;
  editor?: string | null;
}

/**
 * Text element (a container for lines of text)
 */
export interface TextElementDto extends BaseDto {
  __typename: 'TextElementDto';
  id: string;
  pageId: string;
  order: number;
  position?: string | null;
  region?: Array<number | null> | null;
  lines?: Array<LineDto | null> | null;
}

/**
 * Line of text with tokens and states
 */
export interface LineDto extends BaseDto {
  __typename: 'LineDto';
  id: string;
  elementId: string;
  order: number;
  region?: Array<number | null> | null;
  states?: Array<string | null> | null;
  tokens?: Array<string | null> | null;
  lemmas?: Array<string | null> | null;
}

/**
 * Image on the page
 */
export interface ImageDto extends BaseDto {
  __typename: 'ImageDto';
  id: string;
  pageId: string;
  legendId: string;
  legend?: TextElementDto | null;
  location?: Array<number | null> | null;
  motifs?: Array<string | null> | null;
  order: number;
  position?: string | null;
  region?: Array<number | null> | null;
  style?: Array<string | null> | null;
}

/**
 * Segment (marks a unit's location in text)
 */
export interface SegmentDto extends BaseDto {
  __typename: 'SegmentDto';
  id: string;
  mediumId: string;
  unitId: string;
  unit?: SegmentUnitConnection | null;
  startPage: number;
  startLine: number;
  startToken: number;
  endPage: number;
  endLine?: number | null;
  endToken?: number | null;
  lacuna?: boolean | null;
  tags?: Array<string | null> | null;
  type?: string | null;
}

/**
 * Segment's connection to its unit
 */
export interface SegmentUnitConnection {
  __typename: 'SegmentUnitConnection';
  bookId: string;
  id: string;
  parentId: string;
  commentary?: string | null;
  divider?: boolean | null;
  frame?: string | null;
  motifs?: Array<string | null> | null;
  order: number;
  title: string;
  topics?: Array<string | null> | null;
  variant?: string | null;
  version?: number | null;
}

/**
 * Unit (structural element like chapter, section, etc.)
 */
export interface UnitDto extends BaseDto {
  __typename: 'UnitDto';
  bookId: string;
  id: string;
  parentId: string;
  commentary?: string | null;
  divider?: boolean | null;
  frame?: string | null;
  motifs?: Array<string | null> | null;
  order: number;
  title: string;
  topics?: Array<string | null> | null;
  variant?: string | null;
}

// ============================================================================
// Enhanced Entity Types (with additional properties)
// ============================================================================

/**
 * Colored region interface for visual highlighting
 */
export interface IColoredRegion {
  color?: string;
}

/**
 * Text element entity with color
 */
export type TextEntity = Omit<TextElementDto, 'lines'> & IColoredRegion;

/**
 * Array of text entities
 */
export type TextState = Array<TextEntity>;

/**
 * Line entity with color and optional position
 */
export type LineEntity = LineDto & IColoredRegion & { position?: string };

/**
 * Array of line entities
 */
export type LinesState = Array<LineEntity>;

/**
 * Image entity with color
 */
export type ImageEntity = ImageDto & IColoredRegion;

/**
 * Array of image entities
 */
export type ImagesState = Array<ImageEntity>;

/**
 * Segment entity (same as DTO for now)
 */
export type SegmentEntity = SegmentDto;

/**
 * Array of segment entities
 */
export type SegmentsState = Array<SegmentEntity>;

/**
 * Unit segment information for display
 */
export type UnitSegmentInfo = {
  title: string;
  display: string;
  page: number;
  end: number;
  line: number;
  token: number;
  id: string;
  hasEnd: boolean;
};

/**
 * Unit entity with segment info
 */
export type UnitEntity = Omit<UnitDto, 'segments' | 'children'> & {
  segment?: UnitSegmentInfo;
};

/**
 * Array of unit entities
 */
export type UnitsState = Array<UnitEntity>;

// ============================================================================
// Page State Types
// ============================================================================

/**
 * Page state (page info without nested collections)
 */
export type PageState = Omit<PageDto, '__typename' | 'text' | 'images' | 'segments'>;

/**
 * Stored state wrapper for persistence
 */
export interface StoredState<T = any> {
  id: string; // pageId
  version?: number | null;
  data: T;
}

/**
 * Complete fetched state from the server
 */
export interface FetchedState {
  info?: PageState;
  siglum?: string;
  imageDataUrl?: string;
  text: TextState;
  lines: LinesState;
  images: ImagesState;
  segments: SegmentsState;
  openSegments: SegmentsState;
}

/**
 * Page info update payload
 */
export type PageInfoUpdate = {
  commentary?: string | null;
  foliation?: string | null;
  pagination?: number | null;
  tags?: string[] | null;
};

// ============================================================================
// Layout and Visual Types
// ============================================================================

/**
 * Layout element (for visual editing)
 */
export interface ILayoutElement {
  id: string;
  region: Array<number>;
  color: string;
  order: number;
  position?: string;
}

/**
 * Metrics for page rendering
 */
export type Metrics = {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  scaleRatio: number;
};

/**
 * Facsimile space editing modes
 */
export type FacsimileSpaceMode = 'view' | 'edit' | 'preview' | 'review';

/**
 * Facsimile space state
 */
export interface FacsimileSpaceState {
  mode: FacsimileSpaceMode;
  metrics: Metrics;
  regionUnderEdit: ILayoutElement | null;
  selectedPoints: number[] | null;
  hoveredRegion?: string | null;
}

// ============================================================================
// Change Tracking
// ============================================================================

/**
 * Change tracker for dirty state management
 */
export interface IChangeTracker {
  info: boolean;
  text: boolean;
  images: boolean;
  lines: boolean;
  segments: boolean;
  units: boolean;
}

// ============================================================================
// Transcription-Specific Types
// ============================================================================

/**
 * Text class for editor mode
 */
export type EditorTextClass = 'Body' | string;

/**
 * Kalila editor state
 */
export interface KalilaEditorState {
  textClass: EditorTextClass;
}

/**
 * Unit mark in the editor (for segmentation)
 */
export interface UnitMark {
  unit: SegmentUnitConnection;
  position: number;
  type: 'open' | 'close';
}

/**
 * Transcription data structure for the editor
 */
export interface TranscriptionData {
  text: string[];
  colors: string[];
  ids: string[];
  points: number[][];
  rotations: number[];
}

// ============================================================================
// Tool and Chapter Types
// ============================================================================

/**
 * Available editing tools
 */
export type Tool = 'lines' | 'layout' | 'transcription' | 'segmentation' | 'info';

/**
 * Chapter information
 */
export interface IChapter {
  abbr: string;
  name: string;
  id: string;
}

// ============================================================================
// Token State Types
// ============================================================================

/**
 * Token states for text markup
 *
 * These represent various editorial states that can be applied to tokens:
 * - sound: Normal, unmarked text
 * - corrupt: Text marked as corrupt (†)
 * - emended: Text that has been emended (*)
 * - unintelligible: Text that cannot be read (?)
 * - lexicalError: Lexical errors (!)
 * - dittography: Repeated text ([...])
 * - crossOut: Crossed out text ([[...]])
 * - suppletion: Supplied text ({...})
 * - added: Added text (<...>)
 * - title: Title text ((...)
 */
export type TokenState =
  | 'sound'
  | 'corrupt'
  | 'emended'
  | 'unintelligible'
  | 'lexicalError'
  | 'dittography'
  | 'dittographyBegin'
  | 'dittographyEnd'
  | 'crossOut'
  | 'crossOutBegin'
  | 'crossOutEnd'
  | 'suppletion'
  | 'suppletionBegin'
  | 'suppletionEnd'
  | 'added'
  | 'addedBegin'
  | 'addedEnd'
  | 'title'
  | 'titleBegin'
  | 'titleEnd';

/**
 * Parsed token with its state
 */
export interface ParsedToken {
  token: string;
  state: TokenState;
}
