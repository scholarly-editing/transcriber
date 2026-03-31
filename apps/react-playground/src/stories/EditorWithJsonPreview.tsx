import type { IDocument, IEditorConfig } from '@muhaqqiq-editor/react';
import { MuhaqqiqEditor } from '@muhaqqiq-editor/react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

interface StringPreviewProps {
  content: string;
}

interface DocumentPreviewProps {
  document: IDocument;
  config: IEditorConfig;
}

export type EditorWithJsonPreviewProps = StringPreviewProps | DocumentPreviewProps;

function isDocumentPreview(props: EditorWithJsonPreviewProps): props is DocumentPreviewProps {
  return 'document' in props && 'config' in props;
}

export const EditorWithJsonPreview: React.FC<EditorWithJsonPreviewProps> = props => {
  if (isDocumentPreview(props)) {
    return <DocumentModePreview document={props.document} config={props.config} />;
  }
  return <StringModePreview content={props.content} />;
};

const StringModePreview: React.FC<StringPreviewProps> = ({ content }) => {
  const [liveContent, setLiveContent] = useState(content);

  return (
    <div>
      <MuhaqqiqEditor content={liveContent} onChange={setLiveContent} />
      <DocumentJsonViewer value={{ content: liveContent }} title="Editor Content" />
    </div>
  );
};

const DocumentModePreview: React.FC<DocumentPreviewProps> = ({ document, config }) => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(document);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <MuhaqqiqEditor document={document} config={config} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} />
    </div>
  );
};
