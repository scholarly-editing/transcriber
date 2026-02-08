export interface InputData {
    /** Metadata about the current page/column */
    info: {
        pageId: number;
        col: number;
        lang: number;        // Language ID
        thisVersion: number; // Current version ID
        versions: Array<{    // Version history for the dropdown
            id: number;
            time_from: string;
            author_name: string;
            descr: string;
            minor: boolean;
            review: boolean;
        }>;
    };

    /** Editorial notes linked to specific text segments */
    ednotes: Array<{
        id: number;
        text: string;
        // ...other note properties
    }>;

    /** List of people involved (for metadata display) */
    people: Array<{ name: string }>;

    /**
     * THE CONTENT.
     * In the old editor, this was a Quill Delta.
     * For the replacement, this should be a structured JSON tree or
     * a Delta-compatible list of operations representing text + attributes.
     */
    content: any;
}