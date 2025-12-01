import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { LogOut, LayoutGrid, Calendar, User, Settings, Stethoscope, Users, Bell, Menu } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';

const Layout: React.FC = () => {
  const { user, logout, notifications } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return <Outlet />;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNavItems = () => {
    if (user.role === 'patient') {
      return [
        { label: 'Dashboard', icon: LayoutGrid, to: '/patient' },
        { label: 'Book Appointment', icon: Calendar, to: '/patient/book' },
        { label: 'My Profile', icon: User, to: '/patient/profile' },
      ];
    }
    if (user.role === 'doctor') {
      return [
        { label: 'Dashboard', icon: LayoutGrid, to: '/doctor' },
        { label: 'Schedule', icon: Calendar, to: '/doctor/schedule' },
      ];
    }
    if (user.role === 'admin') {
      return [
        { label: 'Overview', icon: LayoutGrid, to: '/admin' },
        { label: 'Doctors', icon: Stethoscope, to: '/admin/doctors' },
        { label: 'Bookings', icon: Users, to: '/admin/bookings' },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen flex bg-transparent text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-black/60 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen z-10 shadow-2xl">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-600 p-2.5 rounded-xl shadow-neon ring-1 ring-white/10">
             <Stethoscope className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            VitalCare
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {getNavItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'text-white font-semibold shadow-neon border border-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent opacity-100"></div>
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary-400' : 'group-hover:text-primary-300'}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-[0_0_10px_#8b5cf6]"></div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-gradient-to-t from-primary-900/10 to-transparent">
          <div className="flex items-center gap-4 px-4 py-3 mb-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
             <div className="relative">
                <img src={user.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-black shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
               <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
             </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-rose-900/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-20 px-4 py-3 flex justify-between items-center shadow-lg">
         <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-primary-600 to-accent-600 p-1.5 rounded-lg shadow-neon">
                <Stethoscope className="text-white w-5 h-5" />
             </div>
             <span className="font-bold text-slate-100 text-lg">VitalCare</span>
         </div>
         <div className="flex items-center gap-4">
             <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-slate-400 hover:text-white transition-colors">
               <Bell className="w-6 h-6" />
               {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-500 rounded-full border border-black shadow-[0_0_8px_#06b6d4]"></span>
               )}
             </button>
             <button onClick={logout}><LogOut className="w-6 h-6 text-slate-400 hover:text-rose-400 transition-colors"/></button>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 pt-24 md:pt-12 overflow-y-auto relative scroll-smooth">
        {/* Decorative ambient background lights */}
        <div className="fixed top-0 left-0 w-full h-96 bg-primary-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Desktop Header Actions */}
        <div className="hidden md:flex justify-end mb-8 relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-full transition-all relative border ${showNotifications ? 'bg-primary-500/20 text-primary-300 border-primary-500/50 shadow-neon' : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:border-white/20 hover:bg-white/10'}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-black shadow-[0_0_8px_#06b6d4]"></span>
                )}
            </button>
            
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
        </div>
        
        {/* Mobile Notification Panel Overlay */}
        {showNotifications && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowNotifications(false)}>
                 <div className="mt-20 mx-4" onClick={(e) => e.stopPropagation()}>
                    <NotificationPanel onClose={() => setShowNotifications(false)} />
                 </div>
            </div>
        )}

        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;