import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import type React from 'react';

interface DocumentJsonViewerProps {
  value: object;
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

export const DocumentJsonViewer: React.FC<DocumentJsonViewerProps> = ({
  value,
  title = 'Parsed Document',
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
