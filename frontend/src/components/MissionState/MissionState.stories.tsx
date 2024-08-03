import type { Meta, StoryObj } from "@storybook/react";

import MissionState from "./";

const meta: Meta<typeof MissionState> = {
  title: "components/MissionState",
  component: MissionState,
};

export default meta;

type Story = StoryObj<typeof MissionState>;

export const Primary: Story = {
  args: {},
};
