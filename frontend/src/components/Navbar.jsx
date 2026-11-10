import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import { BellIcon, SunIcon, MoonIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">💪</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              FitTrack
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          <Link to="/notifications" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <BellIcon className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              )}
              <span className="hidden sm:inline text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.role === 'Admin' && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    Profile
                  </Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    Settings
                  </Link>
                  {user?.role === 'Admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button onClick={() => { setMenuOpen(false); logout(); navigate('/'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500 flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}