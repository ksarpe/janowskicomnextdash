export type Status = "PENDING" | "ACCEPTED" | "CANCELLED";

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Oczekująca",
    color: "#f59e0b",
    bg: "#f59e0b18",
    dot: "#f59e0b",
  },
  ACCEPTED: {
    label: "Zaakceptowana",
    color: "#22c55e",
    bg: "#22c55e18",
    dot: "#22c55e",
  },
  CANCELLED: {
    label: "Odrzucona",
    color: "#ef4444",
    bg: "#ef444418",
    dot: "#ef4444",
  },
};
