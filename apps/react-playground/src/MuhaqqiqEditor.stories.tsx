import type { Meta, StoryObj } from '@storybook/react';
import { MuhaqqiqEditor } from '@muhaqqiq-editor/react';

const meta: Meta<typeof MuhaqqiqEditor> = {
  title: 'MuhaqqiqEditor',
  component: MuhaqqiqEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MuhaqqiqEditor>;

export const Default: Story = {
  args: {
    content: 'Initial content',
  },
};

export const Empty: Story = {
  args: {
    content: '',
  },
};
