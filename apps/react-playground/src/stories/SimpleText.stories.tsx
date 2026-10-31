import { MuhaqqiqEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Simple Text
 *
 * Demonstrates:
 * - String mode initialized with multiline plain text.
 * - Basic line wrapping and editing without complex scholarly document models.
 *
 * How to experiment:
 * - Edit `INITIAL_CONTENT` directly in this file to test other text snippets.
 * - Type or paste text to observe the live JSON output.
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

const INITIAL_CONTENT = `Welcome to Muhaqqiq Editor!

This example demonstrates:
- Multiple lines of plain text
- Initial content loading in string mode
- The power of CodeMirror 6 under the hood`;

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const SimpleTextPreview: React.FC = () => {
  const [content, setContent] = useState<string>(INITIAL_CONTENT);

  return (
    <div>
      <MuhaqqiqEditor content={content} onChange={setContent} />
      <DocumentJsonViewer value={{ content }} title="Live String State" />
    </div>
  );
};

export const SimpleText: Story = {
  render: () => <SimpleTextPreview />,
};
