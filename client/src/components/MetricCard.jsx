export function MetricCard({ label, value, accent }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong style={{ color: accent }}>{value}</strong>
    </article>
  );
}
