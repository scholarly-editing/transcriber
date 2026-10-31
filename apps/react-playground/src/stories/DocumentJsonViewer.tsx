import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import type React from 'react';

/**
 * Props for the DocumentJsonViewer component.
 */
export interface IDocumentJsonViewerProps {
  /** The object/document state to display as an interactive JSON tree. */
  value: object;
  /** Optional title shown in the viewer header bar. */
  title?: string;
}

const containerStyle: React.CSSProperties = {
  marginTop: 16,
  border: '1px solid #3c3c3c',
  borderRadius: 6,
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#2d2d2d',
  borderBottom: '1px solid #3c3c3c',
  color: '#cccccc',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'system-ui, sans-serif',
};

const viewerStyle: React.CSSProperties = {
  maxHeight: 420,
  overflow: 'auto',
  padding: 8,
};

/**
 * Renders an expandable JSON viewer for inspection of live document/editor state.
 */
export const DocumentJsonViewer: React.FC<IDocumentJsonViewerProps> = ({
  value,
  title = 'Parsed Document (Live JSON)',
}) => (
  <div style={containerStyle}>
    <div style={headerStyle}>{title}</div>
    <div style={viewerStyle}>
      <JsonView
        value={value}
        style={vscodeTheme}
        collapsed={2}
        displayDataTypes={false}
        enableClipboard={true}
      />
    </div>
  </div>
);
