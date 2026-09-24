import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormLayoutProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function FormLayout({ title, description, eyebrow, children, actions, className }: FormLayoutProps) {
  return (
    <section className={cn("form-layout", className)}>
      <header className="form-layout__header">
        {eyebrow ? <span className="form-layout__eyebrow">{eyebrow}</span> : null}
        <h1 className="form-layout__title">{title}</h1>
        {description ? <p className="form-layout__description">{description}</p> : null}
      </header>
      <div className="form-layout__body">
        {children}
        {actions ? <div className="form-layout__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
