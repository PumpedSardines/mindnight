import type { Meta, StoryObj } from "@storybook/react";

import Character from "./";

const meta: Meta<typeof Character> = {
  title: "components/Character",
  component: Character,
};

export default meta;

type Story = StoryObj<typeof Character>;

export const Primary: Story = {
  args: {
    character: {
      color: "red",
      body: "square",
      face: "a",
    },
  },
};
