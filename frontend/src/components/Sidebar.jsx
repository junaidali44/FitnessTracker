import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FireIcon,
  CakeIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const nav = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Workouts', path: '/workouts', icon: FireIcon },
  { name: 'Nutrition', path: '/nutrition', icon: CakeIcon },
  { name: 'Progress', path: '/progress', icon: ChartBarIcon },
  { name: 'Notifications', path: '/notifications', icon: BellIcon },
  { name: 'Feedback', path: '/feedback', icon: ChatBubbleLeftIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky lg:top-16 inset-y-0 left-0 w-64 h-[calc(100vh-4rem)] bg-black/80 backdrop-blur-md border-r border-black-border transform transition-transform duration-300 z-40 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-3">
          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    active
                      ? 'bg-gradient-to-r from-crimson-600/90 to-accent/90 text-white shadow-glow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-black-card'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active
                        ? 'text-white'
                        : 'text-text-muted group-hover:text-text-primary'
                    }`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-black-border">
            <div className="px-3 py-2 text-xs text-text-muted">
              <p className="font-medium text-text-secondary">Team CodeSlayers</p>
              <p>Fitness Tracker v1.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}