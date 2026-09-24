import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ className, id, label, hint, error, options, placeholder, required, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="ui-field">
      {label ? (
        <label className="ui-label" htmlFor={selectId}>
          {label} {required ? <span className="ui-required">*</span> : null}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn("ui-select", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? messageId : undefined}
        required={required}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error || hint ? (
        <span id={messageId} className={error ? "ui-error" : "ui-hint"} role={error ? "alert" : undefined}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
