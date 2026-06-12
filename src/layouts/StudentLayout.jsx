import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FiHome, FiList, FiClock, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const menu = [
    { name: 'Dashboard', path: '/student', icon: FiHome },
    { name: 'Available Exams', path: '/student/exams', icon: FiList },
    { name: 'History', path: '/student/history', icon: FiClock },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Student Portal</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 block sm:hidden">
          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Hello, {user?.name}</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/student' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                <Icon className="mr-3" /> {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors">
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-4 lg:px-8 justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FiMenu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
               {location.pathname.split('/').pop() || 'Dashboard'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Hello, {user?.name}</span>
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-3 py-1.5 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-md text-sm font-medium transition-colors dark:bg-primary-900/30 dark:text-primary-400">
                Go to Admin Portal
              </Link>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}