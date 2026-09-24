import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth = false, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "ui-button",
        `ui-button-${variant}`,
        size === "icon" ? "ui-button-icon" : size === "sm" ? "ui-button-sm" : size === "lg" ? "ui-button-lg" : undefined,
        fullWidth ? "ui-button-full" : undefined,
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
