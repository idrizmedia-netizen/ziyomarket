export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
      <div className="bg-bg rounded-lg p-2.5 text-primary">{icon}</div>
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="text-[17px] font-bold">{value}</div>
      </div>
    </div>
  );
}
