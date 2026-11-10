import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  BoltIcon,
} from '@heroicons/react/24/outline';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchCount = () => {
      api.get('/notifications?unreadOnly=true&limit=1')
        .then(res => setUnread(res.data.unreadCount || 0))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="h-16 bg-black/80 backdrop-blur-md border-b border-black-border sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-black-card rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">
              FitTrack
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/notifications"
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-black-card rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson-500 rounded-full ring-2 ring-black" />
            )}
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 pr-2 hover:bg-black-card rounded-lg transition-colors"
              aria-label="User menu"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-crimson-600/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center text-white font-display font-bold text-sm">
                  {user?.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-text-primary">
                {user?.fullName?.split(' ')[0]}
              </span>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 glass-card p-2 z-20 animate-scale-in">
                  <div className="px-3 py-2.5 border-b border-black-border mb-1">
                    <p className="font-semibold text-text-primary text-sm truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {user?.email}
                    </p>
                    {user?.role === 'Admin' && (
                      <span className="inline-block mt-1.5 badge-primary text-2xs">
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-black-elevated rounded-lg transition-colors"
                  >
                    <UserCircleIcon className="w-4 h-4" />
                    Profile
                  </Link>

                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-crimson-400 hover:text-crimson-300 hover:bg-crimson-600/10 rounded-lg transition-colors"
                    >
                      <BoltIcon className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-black-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-crimson-400 hover:text-crimson-300 hover:bg-crimson-600/10 rounded-lg transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}