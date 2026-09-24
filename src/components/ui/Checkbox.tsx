import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function Checkbox({ id, label, description, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label className="ui-checkbox" htmlFor={checkboxId}>
      <input id={checkboxId} className="ui-checkbox__control" type="checkbox" {...props} />
      <span>
        <span className="ui-checkbox__label">{label}</span>
        {description ? <span className="ui-checkbox__description">{description}</span> : null}
      </span>
    </label>
  );
}
