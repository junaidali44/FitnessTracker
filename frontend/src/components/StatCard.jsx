export default function StatCard({ icon, label, value, subtitle, color = 'primary', trend }) {
  const colorMap = {
    primary: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };

  return (
    <div className="card p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <div className="text-2xl">{icon}</div>
        </div>
      </div>
      {trend && (
        <div className="mt-3 text-xs font-medium">
          <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-400 ml-1">vs last week</span>
        </div>
      )}
    </div>
  );
}