import type { Meta, StoryObj } from "@storybook/react";

import Button from "./";

const meta: Meta<typeof Button> = {
  title: "components/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Click me!",
    onClick: () => {
      console.log("Clicked!");
    },
  },
};
