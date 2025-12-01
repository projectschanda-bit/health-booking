import React from 'react';
import { useStore } from '../store';
import { User, Trash2, Plus, Stethoscope, Calendar, Server } from 'lucide-react';
import { formatDate } from '../utils';

const AdminDashboard: React.FC = () => {
  const { doctors, appointments, removeDoctor } = useStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Administration</h2>
        <p className="text-slate-400 mt-1">System overview and management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-[40px] group-hover:bg-primary-500/20 transition-all"></div>
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800/50 rounded-lg text-primary-400 border border-white/5">
                      <Stethoscope className="w-5 h-5"/>
                  </div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Doctors</h3>
               </div>
               <p className="text-4xl font-bold text-white">{doctors.length}</p>
           </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-[40px] group-hover:bg-accent-500/20 transition-all"></div>
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800/50 rounded-lg text-accent-400 border border-white/5">
                      <Calendar className="w-5 h-5"/>
                  </div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Appointments</h3>
               </div>
               <p className="text-4xl font-bold text-white">{appointments.length}</p>
           </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800/50 rounded-lg text-green-400 border border-white/5">
                      <Server className="w-5 h-5"/>
                  </div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">System Status</h3>
               </div>
               <div className="flex items-center gap-3">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 <p className="font-bold text-xl text-slate-200">Operational</p>
               </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctors Management */}
        <div className="glass-card rounded-3xl border border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-xl text-white">Manage Doctors</h3>
             <button className="p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20">
               <Plus className="w-5 h-5" />
             </button>
          </div>
          <div className="space-y-4">
             {doctors.map(doc => (
               <div key={doc.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all bg-black/20 group">
                  <div className="flex items-center gap-4">
                     <img src={doc.avatar} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-primary-500/50 transition-all" alt={doc.name} />
                     <div>
                       <p className="font-bold text-slate-200 group-hover:text-primary-300 transition-colors">{doc.name}</p>
                       <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{doc.specialty}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => removeDoctor(doc.id)}
                    className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove Doctor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
             ))}
          </div>
        </div>

        {/* Global Schedule Overview */}
        <div className="glass-card rounded-3xl border border-white/5 p-8 flex flex-col">
           <h3 className="font-bold text-xl text-white mb-6">Clinic Schedule (EST)</h3>
           <div className="space-y-2 flex-1">
             {[
               { day: 'Monday', hours: '02:00 AM - 11:00 AM' },
               { day: 'Tuesday', hours: '02:00 AM - 02:00 PM' },
               { day: 'Wednesday', hours: '02:00 AM - 02:00 PM' },
               { day: 'Thursday', hours: '02:00 AM - 02:00 PM' },
               { day: 'Friday', hours: '02:00 AM - 07:00 AM, 11:00 AM - 02:00 PM' },
             ].map((s, i) => (
               <div key={i} className="flex justify-between text-sm p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                 <span className="font-bold text-slate-300 w-24">{s.day}</span>
                 <span className="text-slate-400 font-mono">{s.hours}</span>
               </div>
             ))}
           </div>
           <div className="mt-8 pt-6 border-t border-white/10">
             <button className="w-full py-3.5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all hover:border-white/20">
               Edit Global Availability
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;