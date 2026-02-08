import { MuhaqqiqEditor } from '@muhaqqiq-editor/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';

const meta = {
  title: 'CoreMuhaqqiq',
  component: MuhaqqiqEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MuhaqqiqEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component for controlled story
const ControlledEditorExample: React.FC = () => {
  const [content, setContent] = useState(
    'This is a controlled editor.\n\nType here to see the state update in real-time.'
  );
  return <MuhaqqiqEditor content={content} onChange={setContent} />;
};

export const Empty: Story = {
  args: {
    content: '',
  },
};

export const WithContent: Story = {
  args: {
    content:
      'Welcome to Muhaqqiq Editor!\n\nThis example demonstrates:\n- Multiple lines\n- Initial content\n- The power of CodeMirror 6',
  },
};

export const Controlled: Story = {
  render: () => <ControlledEditorExample />,
};
