"use client";

import Tabs from "../ui/Tabs";

type Props = {
  value: string;
  onChange: (
    value: "all" | "done" | "pending" | "late"
  ) => void;
};

export default function TaskFilter({
  value,
  onChange,
}: Props) {
  return (
    <Tabs
      active={value}
      onChange={(v) =>
        onChange(
          v as
            | "all"
            | "done"
            | "pending"
            | "late"
        )
      }
      tabs={[
        {
          label: "All",
          value: "all",
        },
        {
          label: "Done",
          value: "done",
        },
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Late",
          value: "late",
        },
      ]}
    />
  );
}