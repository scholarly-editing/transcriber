import type React from 'react';

export interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export const MuhaqqiqEditor: React.FC<EditorProps> = ({ content, onChange }) => {
  return (
    <div className="muhaqqiq-editor">
      <textarea
        value={content}
        onChange={e => onChange?.(e.target.value)}
        placeholder="Type something..."
        style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '10px' }}
      />
    </div>
  );
};
