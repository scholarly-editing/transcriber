import type { Meta, StoryObj } from '@storybook/react-vite';
import {MuhaqqiqEditor} from "@muhaqqiq-editor/react";

const meta = {
  title: 'Example/Page',
  component: MuhaqqiqEditor,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MuhaqqiqEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
};
