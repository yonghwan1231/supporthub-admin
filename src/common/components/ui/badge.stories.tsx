import { Badge } from "@/common/components/ui/badge";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Common/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["slate", "cyan", "amber", "emerald", "rose", "violet"],
    },
  },
  args: {
    children: "Badge",
    tone: "slate",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="slate">대기</Badge>
      <Badge tone="cyan">처리중</Badge>
      <Badge tone="emerald">완료</Badge>
      <Badge tone="amber">높음</Badge>
      <Badge tone="rose">긴급</Badge>
      <Badge tone="violet">커스텀</Badge>
    </div>
  ),
};
