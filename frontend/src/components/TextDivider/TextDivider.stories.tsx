import type { Meta, StoryObj } from "@storybook/react";

import TextDivider from "./";

const meta: Meta<typeof TextDivider> = {
  title: "components/TextDivider",
  component: TextDivider,
};

export default meta;

type Story = StoryObj<typeof TextDivider>;

export const Primary: Story = {
  args: {
    text: "Or",
  },
};
