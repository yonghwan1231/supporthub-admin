"use client";

import { useState } from "react";
import { ListFilterBar } from "@/common/components/ui/list-filter-bar";
import type { ListFilterField } from "@/common/components/ui/list-filter-bar";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type TicketFilterValues = {
  keyword: string;
  priority: string;
  sort: string;
  status: string;
};

const initialValue: TicketFilterValues = {
  keyword: "",
  priority: "all",
  sort: "latest",
  status: "all",
};

const fields: ListFilterField<keyof TicketFilterValues & string>[] = [
  {
    label: "Status",
    name: "status",
    options: [
      { label: "전체", value: "all" },
      { label: "대기", value: "open" },
      { label: "처리중", value: "in_progress" },
      { label: "완료", value: "resolved" },
      { label: "보류", value: "hold" },
    ],
    type: "select",
  },
  {
    label: "Priority",
    name: "priority",
    options: [
      { label: "전체", value: "all" },
      { label: "낮음", value: "low" },
      { label: "보통", value: "medium" },
      { label: "높음", value: "high" },
      { label: "긴급", value: "urgent" },
    ],
    type: "select",
  },
  {
    label: "Sort",
    name: "sort",
    options: [
      { label: "최신순", value: "latest" },
      { label: "오래된순", value: "oldest" },
      { label: "우선순위순", value: "priority" },
    ],
    type: "select",
  },
  {
    className: "min-w-80",
    label: "Search",
    name: "keyword",
    placeholder: "제목, 고객명, 이메일, 태그 검색",
    type: "search",
  },
];

const meta = {
  title: "Common/ListFilterBar",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const TicketFilters: Story = {
  render: () => <ListFilterBarDemo />,
};

export const NarrowWidth: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <div className="max-w-sm">
      <ListFilterBarDemo />
    </div>
  ),
};

function ListFilterBarDemo() {
  const [value, setValue] = useState<TicketFilterValues>(initialValue);
  const [submitted, setSubmitted] = useState<TicketFilterValues>(initialValue);

  return (
    <div className="grid gap-4">
      <ListFilterBar
        fields={fields}
        value={value}
        onChange={(patch) =>
          setValue((current) => ({
            ...current,
            ...patch,
          }))
        }
        onReset={() => {
          setValue(initialValue);
          setSubmitted(initialValue);
        }}
        onSubmit={() => setSubmitted(value)}
      />

      <pre className="rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </div>
  );
}
