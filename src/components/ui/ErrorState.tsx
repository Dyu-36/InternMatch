import type { ReactNode } from "react";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({ title = "Có lỗi xảy ra", description = "Vui lòng thử lại sau.", action }: ErrorStateProps) {
  return (
    <div className="ui-state ui-state--error" role="alert">
      <div>
        <p className="ui-state__title">{title}</p>
        <p className="ui-state__description">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
