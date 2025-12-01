import React from 'react';
import { useStore } from '../store';
import { Bell, Check, Trash2, Mail, Calendar } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useStore();
  
  // Sort by newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 glass-panel rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden ring-1 ring-white/10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-2">
           <Bell className="w-4 h-4 text-primary-400" />
           <h3 className="font-bold text-slate-200 text-sm">Notifications</h3>
           {unreadCount > 0 && (
             <span className="px-1.5 py-0.5 bg-accent-600 text-white text-[10px] rounded-full font-bold shadow-neon">
               {unreadCount}
             </span>
           )}
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAllNotifications}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto bg-black/60">
        {sortedNotifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {sortedNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 hover:bg-white/5 transition-colors group relative cursor-pointer ${!notif.read ? 'bg-primary-900/10' : ''}`}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/5 ${
                    notif.type === 'reminder' ? 'bg-amber-500/10 text-amber-500' : 
                    notif.type === 'digest' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {notif.type === 'reminder' && <Calendar className="w-4 h-4" />}
                    {notif.type === 'digest' && <Mail className="w-4 h-4" />}
                    {notif.type === 'system' && <Check className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm ${!notif.read ? 'font-bold text-slate-100' : 'font-medium text-slate-400'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 block mt-1 shadow-neon"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                      {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {notif.type === 'reminder' && ' • Email Sent'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Bell className="w-8 h-8 text-slate-800 mb-2" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-black/40 border-t border-white/10 text-center">
        <button 
            onClick={onClose}
            className="text-xs font-medium text-slate-400 hover:text-white"
        >
            Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;