import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ className, id, label, hint, error, required, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="ui-field">
      {label ? (
        <label className="ui-label" htmlFor={inputId}>
          {label} {required ? <span className="ui-required">*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn("ui-input", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? messageId : undefined}
        required={required}
        {...props}
      />
      {error || hint ? (
        <span id={messageId} className={error ? "ui-error" : "ui-hint"} role={error ? "alert" : undefined}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
