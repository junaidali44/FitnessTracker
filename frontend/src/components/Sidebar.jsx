import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon, FireIcon, CakeIcon, ChartBarIcon,
  BellIcon, Cog6ToothIcon, ChatBubbleLeftIcon, UserCircleIcon
} from '@heroicons/react/24/outline';

const nav = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Workouts', path: '/workouts', icon: FireIcon },
  { name: 'Nutrition', path: '/nutrition', icon: CakeIcon },
  { name: 'Progress', path: '/progress', icon: ChartBarIcon },
  { name: 'Notifications', path: '/notifications', icon: BellIcon },
  { name: 'Feedback', path: '/feedback', icon: ChatBubbleLeftIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon }
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-40 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex-1 space-y-1">
            {nav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}