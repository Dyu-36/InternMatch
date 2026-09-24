export interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Đang tải dữ liệu…" }: LoadingStateProps) {
  return (
    <div className="ui-state" role="status" aria-live="polite">
      <span className="ui-spinner" aria-hidden="true" />
      <p className="ui-state__description">{label}</p>
    </div>
  );
}
