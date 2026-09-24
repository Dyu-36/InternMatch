import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="ui-state">
      <div>
        <p className="ui-state__title">{title}</p>
        {description ? <p className="ui-state__description">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
