import React from 'react';
import { NavLink } from 'react-router-dom'; // We will use HashRouter, so this works
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Bot, 
  LogOut, 
  Menu,
  X,
  Target
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/syllabus', label: 'Syllabus Tracker', icon: BookOpen },
    { to: '/tests', label: 'Mock Tests', icon: LineChart },
    { to: '/assistant', label: 'AI Tutor', icon: Bot },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-2">
        <Target className="text-blue-400 w-8 h-8" />
        <span className="text-xl font-bold text-white tracking-tight">BankPrep Pro</span>
      </div>
      
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Welcome</p>
        <p className="text-white font-medium truncate">{user.username}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-slate-900 flex-shrink-0 text-white shadow-xl z-20">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4 md:hidden">
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-2">
            <Target className="text-blue-600 w-6 h-6" />
            <span className="text-lg font-bold text-slate-800">BankPrep Pro</span>
          </div>
          <button onClick={toggleSidebar} className="text-slate-600 hover:text-slate-900 p-1">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};