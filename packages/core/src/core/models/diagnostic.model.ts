/** Parser diagnostic information exposed to consumers. */
export interface IParserDiagnostic {
  /** Start offset in the editor text */
  from: number;
  /** End offset in the editor text */
  to: number;
  /** Line number (1-based) */
  line: number;
  /** The error token text */
  token: string;
  /** Human-readable error message */
  message: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
}
