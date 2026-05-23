"use client";

import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input, Select } from "@/common/components/ui/field";
import { cn } from "@/common/lib/cn";
import type { ReactNode } from "react";

export type ListFilterOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type ListFilterField<TName extends string = string> = {
  className?: string;
  controlClassName?: string;
  label: ReactNode;
  name: TName;
  options?: ListFilterOption[];
  placeholder?: string;
  type: "select" | "search" | "text";
};

export type ListFilterBarProps<
  TValues extends object,
  TName extends keyof TValues & string = keyof TValues & string,
> = {
  className?: string;
  fields: Array<ListFilterField<TName>>;
  onChange: (patch: Partial<TValues>) => void;
  onReset: () => void;
  onSubmit: () => void;
  resetLabel?: string;
  submitLabel?: string;
  value: TValues;
};

export function ListFilterBar<
  TValues extends object,
  TName extends keyof TValues & string = keyof TValues & string,
>({
  className,
  fields,
  onChange,
  onReset,
  onSubmit,
  resetLabel = "초기화",
  submitLabel = "검색",
  value,
}: ListFilterBarProps<TValues, TName>) {
  return (
    <form
      className={cn("rounded-md border border-line bg-panel p-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        {fields.map((field) => (
          <FilterControl
            field={field}
            key={field.name}
            onChange={onChange}
            value={value}
          />
        ))}

        <div className="flex shrink-0 items-end gap-2">
          <Button className="w-24" type="submit">
            <Search aria-hidden size={16} />
            {submitLabel}
          </Button>
          <Button
            className="w-24"
            onClick={onReset}
            type="button"
            variant="ghost"
          >
            <RotateCcw aria-hidden size={16} />
            {resetLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

function FilterControl<
  TValues extends object,
  TName extends keyof TValues & string,
>({
  field,
  onChange,
  value,
}: {
  field: ListFilterField<TName>;
  onChange: (patch: Partial<TValues>) => void;
  value: TValues;
}) {
  const fieldValue = String(value[field.name] ?? "");
  const wrapperClassName = cn(
    field.type === "search" ? "min-w-0 flex-1" : "w-full sm:w-40 lg:w-32",
    field.className,
  );

  return (
    <label className={wrapperClassName}>
      <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
        {field.label}
      </span>

      {field.type === "select" && (
        <Select
          className={field.controlClassName}
          value={fieldValue}
          onChange={(event) =>
            onChange({
              [field.name]: event.target.value,
            } as Partial<TValues>)
          }
        >
          {(field.options ?? []).map((option) => (
            <option
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </Select>
      )}

      {field.type !== "select" && (
        <span className="relative block">
          {field.type === "search" ? (
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
          ) : null}
          <Input
            className={cn(
              field.type === "search" && "pl-9",
              field.controlClassName,
            )}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={(event) =>
              onChange({
                [field.name]: event.target.value,
              } as Partial<TValues>)
            }
          />
        </span>
      )}
    </label>
  );
}
