import { Search, Trash2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost"],
    },
  },
  args: {
    children: "버튼",
    variant: "primary",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>
        <Search className="h-4 w-4" />
        검색
      </Button>
      <Button variant="danger">
        <Trash2 className="h-4 w-4" />
        삭제
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "비활성",
    disabled: true,
  },
};
