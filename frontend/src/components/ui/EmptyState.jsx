export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="glass-card p-12 text-center">
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-crimson-600/10 border border-crimson-600/20 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">{title}</h3>
      {message && <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">{message}</p>}
      {action}
    </div>
  );
}