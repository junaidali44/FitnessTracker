import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const caloriesChart = [
    { name: 'Burned', value: data.today.caloriesBurned },
    { name: 'Consumed', value: data.today.caloriesConsumed }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p className="text-white/90 mt-1">Let's crush your fitness goals today</p>
          {data.streak?.current > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
              🔥 {data.streak.current} day streak!
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Today's Workouts" value={data.today.workouts} color="orange" />
        <StatCard icon="⚡" label="Calories Burned" value={data.today.caloriesBurned} color="red" />
        <StatCard icon="🍽️" label="Meals Logged" value={data.today.meals} color="blue" />
        <StatCard icon="📊" label="Week Workouts" value={data.thisWeek.workoutsCompleted} subtitle={`${data.thisWeek.totalDuration} min`} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Today's Calories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={caloriesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/workouts/new" className="p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl text-center transition-colors">
              <div className="text-3xl mb-1">🔥</div>
              <p className="font-medium text-sm">Log Workout</p>
            </Link>
            <Link to="/nutrition/new" className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl text-center transition-colors">
              <div className="text-3xl mb-1">🍽️</div>
              <p className="font-medium text-sm">Log Meal</p>
            </Link>
            <Link to="/progress/new" className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl text-center transition-colors">
              <div className="text-3xl mb-1">📏</div>
              <p className="font-medium text-sm">Log Progress</p>
            </Link>
            <Link to="/workouts" className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-center transition-colors">
              <div className="text-3xl mb-1">📊</div>
              <p className="font-medium text-sm">View History</p>
            </Link>
          </div>
        </div>
      </div>

      {data.today.workoutsList?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Today's Workouts</h2>
          <div className="space-y-2">
            {data.today.workoutsList.map(w => (
              <div key={w._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.category} • {w.duration} min</p>
                </div>
                <span className="text-sm font-medium text-orange-500">🔥 {w.caloriesBurned}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}