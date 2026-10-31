import { MuhaqqiqEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Empty Editor
 *
 * Demonstrates:
 * - Simple backward-compatible string-mode initialization with an empty initial string.
 * - Live typing updates reflected directly in the JSON state below.
 *
 * How to experiment:
 * - Type in the editor above to see real-time updates in the JSON viewer.
 */

const meta = {
  title: 'MuhaqqiqEditor',
  component: MuhaqqiqEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MuhaqqiqEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Sample Data & Settings
// ---------------------------------------------------------------------------

const INITIAL_CONTENT = '';

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const EmptyEditorPreview: React.FC = () => {
  const [content, setContent] = useState<string>(INITIAL_CONTENT);

  return (
    <div>
      <MuhaqqiqEditor content={content} onChange={setContent} />
      <DocumentJsonViewer value={{ content }} title="Live String State" />
    </div>
  );
};

export const EmptyEditor: Story = {
  render: () => <EmptyEditorPreview />,
};
