import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LogOut, Upload, BarChart3, History, Settings, User, Sparkles, Crown } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'History', href: '/history', icon: History },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  if (location.pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-barbie-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-barbie-500 to-barbie-600 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 bg-barbie-700">
            <Crown className="text-white mr-2" size={28} />
            <h1 className="text-xl font-bold text-white">Excel Analytics</h1>
            <Sparkles className="text-barbie-200 ml-1" size={16} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'bg-white text-barbie-600 shadow-lg'
                      : 'text-barbie-100 hover:bg-barbie-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
            
            {user?.role === 'admin' && adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'bg-white text-barbie-600 shadow-lg'
                      : 'text-barbie-100 hover:bg-barbie-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-barbie-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User size={20} className="text-barbie-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-barbie-200">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-barbie-200 hover:text-white transition-colors hover:bg-barbie-400 rounded-lg"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;