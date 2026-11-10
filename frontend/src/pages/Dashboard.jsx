import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Spinner, Button } from '../components/ui';
import {
  FireIcon,
  CakeIcon,
  ChartBarSquareIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  ArrowRightIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Stat card component
function StatCard({ icon: Icon, label, value, subtitle, accent = 'crimson' }) {
  const accentClasses = {
    crimson: 'text-crimson-400 bg-crimson-600/10 border-crimson-600/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="glass-card-hover p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg border flex items-center justify-center ${accentClasses[accent]} group-hover:shadow-glow-sm transition-all`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-medium">
        {label}
      </p>
      <p className="text-3xl font-display font-bold text-text-primary">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-text-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" label="Loading your dashboard..." />
      </div>
    );
  }

  if (!data) return null;

  const caloriesChart = [
    { name: 'Burned', value: data.today.caloriesBurned, fill: '#dc2626' },
    { name: 'Consumed', value: data.today.caloriesConsumed, fill: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ============ HERO ============ */}
      <div className="relative glass-card p-6 md:p-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted mb-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
              Welcome back, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-sm text-text-secondary">
              Let's make today count.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {data.streak?.current > 0 && (
              <div className="px-4 py-2 rounded-xl bg-crimson-600/10 border border-crimson-600/30 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-crimson-400" />
                <div>
                  <p className="text-lg font-display font-bold text-crimson-400 leading-none">
                    {data.streak.current}
                  </p>
                  <p className="text-2xs text-text-muted uppercase tracking-wider">
                    Day streak
                  </p>
                </div>
              </div>
            )}
            <Link to="/workouts/new">
              <Button variant="primary" className="hidden sm:inline-flex">
                <PlusIcon className="w-4 h-4" />
                Log Workout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FireIcon}
          label="Today's Workouts"
          value={data.today.workouts}
          accent="crimson"
        />
        <StatCard
          icon={BoltIcon}
          label="Calories Burned"
          value={data.today.caloriesBurned}
          accent="amber"
        />
        <StatCard
          icon={CakeIcon}
          label="Meals Logged"
          value={data.today.meals}
          accent="emerald"
        />
        <StatCard
          icon={ChartBarSquareIcon}
          label="This Week"
          value={data.thisWeek.workoutsCompleted}
          subtitle={`${data.thisWeek.totalDuration} min total`}
          accent="blue"
        />
      </div>

      {/* ============ CHART + QUICK ACTIONS ============ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold">Today's Calories</h2>
              <p className="text-xs text-text-muted">
                Burned vs. consumed
              </p>
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-text-muted" />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={caloriesChart} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#262626' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                axisLine={{ stroke: '#262626' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  color: '#fafafa',
                }}
                cursor={{ fill: 'rgba(220, 38, 38, 0.05)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Log Workout', icon: FireIcon, path: '/workouts/new', accent: 'crimson' },
              { label: 'Log Meal', icon: CakeIcon, path: '/nutrition/new', accent: 'emerald' },
              { label: 'Add Progress', icon: ChartBarSquareIcon, path: '/progress/new', accent: 'amber' },
              { label: 'View History', icon: ArrowTrendingUpIcon, path: '/workouts', accent: 'blue' },
            ].map((action) => {
              const Icon = action.icon;
              const accentClasses = {
                crimson: 'border-crimson-600/20 hover:border-crimson-600/50 hover:bg-crimson-600/5',
                emerald: 'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5',
                amber: 'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5',
                blue: 'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5',
              };

              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className={`p-4 rounded-xl border bg-black-card/50 transition-all group ${accentClasses[action.accent]}`}
                >
                  <Icon className="w-6 h-6 text-text-secondary mb-2 group-hover:text-text-primary transition-colors" />
                  <p className="text-sm font-medium text-text-primary">
                    {action.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ TODAY'S WORKOUTS ============ */}
      {data.today.workoutsList?.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold">
              Today's Workouts
            </h2>
            <Link
              to="/workouts"
              className="text-sm text-crimson-400 hover:text-crimson-300 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {data.today.workoutsList.map((w) => (
              <div
                key={w._id}
                className="flex items-center justify-between p-4 bg-black-elevated/50 border border-black-border rounded-xl hover:border-crimson-600/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-crimson-600/10 border border-crimson-600/20 flex items-center justify-center">
                    <FireIcon className="w-5 h-5 text-crimson-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-primary">
                      {w.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {w.category} · {w.duration} min
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-crimson-400">
                  {w.caloriesBurned} cal
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ EMPTY STATE ============ */}
      {data.today.workoutsList?.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-crimson-600/10 border border-crimson-600/20 flex items-center justify-center mx-auto mb-4">
            <FireIcon className="w-8 h-8 text-crimson-400" />
          </div>
          <h3 className="text-lg font-display font-bold mb-2">
            No workouts yet today
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            Log your first workout to start tracking progress and building your streak.
          </p>
          <Link to="/workouts/new">
            <Button variant="primary">
              <PlusIcon className="w-4 h-4" />
              Log First Workout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}