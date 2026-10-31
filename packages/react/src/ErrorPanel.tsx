import type { IParserDiagnostic } from '@scholarly-editing/transcriber-core';
import type React from 'react';
import './ErrorPanel.css';

export interface ErrorPanelProps {
  /** List of parser diagnostics to display */
  diagnostics: IParserDiagnostic[];
  /** Called when a diagnostic is clicked (for scroll-to-error) */
  onDiagnosticClick?: (diagnostic: IParserDiagnostic) => void;
  /** Optional CSS class for the root element */
  className?: string;
}

export const SedErrorPanel: React.FC<ErrorPanelProps> = ({
  diagnostics,
  onDiagnosticClick,
  className,
}) => {
  const handleItemClick = (diagnostic: IParserDiagnostic): void => {
    onDiagnosticClick?.(diagnostic);
  };

  return (
    <div className={`sed-error-panel ${className ?? ''}`}>
      <div className="sed-error-panel__header">
        <span className="sed-error-panel__count">
          {diagnostics.length} {diagnostics.length === 1 ? 'error' : 'errors'}
        </span>
      </div>
      {diagnostics.length === 0 ? (
        <div className="sed-error-panel__empty">No errors</div>
      ) : (
        <ul className="sed-error-panel__list">
          {diagnostics.map((d, i) => (
            <li key={`${d.from}-${d.to}-${i}`} className="sed-error-panel__item">
              <button
                type="button"
                className="sed-error-panel__item-button"
                onClick={() => handleItemClick(d)}
              >
                <span className="sed-error-panel__severity" data-severity={d.severity} />
                <span className="sed-error-panel__message">{d.message}</span>
                <span className="sed-error-panel__location">Line {d.line}</span>
                <code className="sed-error-panel__token">{d.token}</code>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
