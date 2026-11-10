export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="card p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
      {action}
    </div>
  );
}