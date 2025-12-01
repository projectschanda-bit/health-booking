import React, { useState } from 'react';
import { useStore } from '../store';
import { formatDate, formatTime } from '../utils';
import { User, Calendar, Clock, Check, Activity, Users, Zap } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user, appointments, doctors } = useStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  // Filter appointments for this doctor
  const myAppointments = appointments
    .filter(a => a.doctorId === user?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcoming = myAppointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
  const history = myAppointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  const displayed = activeTab === 'upcoming' ? upcoming : history;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-4xl font-bold text-white tracking-tight">Dr. {user?.name.split(' ')[1]}</h2>
           <p className="text-slate-400 mt-1">Manage your schedule and patient notes.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-950/30 border border-green-500/30 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
           <span className="text-sm font-bold text-green-400">Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-[40px] group-hover:bg-primary-500/20 transition-all"></div>
           <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-primary-400 mb-4 border border-white/5">
                 <Users className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Total Patients</p>
              <p className="text-4xl font-bold text-white">{new Set(myAppointments.map(a => a.patientId)).size}</p>
           </div>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-[40px] group-hover:bg-accent-500/20 transition-all"></div>
           <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-accent-400 mb-4 border border-white/5">
                 <Calendar className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Upcoming Sessions</p>
              <p className="text-4xl font-bold text-white">{upcoming.length}</p>
           </div>
        </div>
        
        <div className="glass-card p-6 rounded-3xl border border-white/5 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-3">
                 <Activity className="w-5 h-5 text-green-400" />
                 <h3 className="font-bold text-slate-200">System Status</h3>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                 Your schedule is synced with the central clinic calendar. EST timezone applied. 
                 <br/><span className="text-xs text-slate-500">Mon: 2-11am | Tue-Thu: 2am-2pm | Fri: 2-7am & 11am-2pm (EST)</span>
               </p>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-5 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'upcoming' ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            Upcoming Appointments
            {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 shadow-[0_0_10px_#8b5cf6]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-5 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            History
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 shadow-[0_0_10px_#8b5cf6]"></div>}
          </button>
        </div>

        <div className="flex-1 bg-slate-900/20">
          {displayed.length > 0 ? (
            <div className="divide-y divide-white/5">
              {displayed.map(appt => (
                <AppointmentRow key={appt.id} appointment={appt} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12">
               <Calendar className="w-12 h-12 mb-4 opacity-20" />
               <p>No appointments found in this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentRow: React.FC<{ appointment: any }> = ({ appointment }) => {
  const patientName = "Alex Johnson"; 
  const notes = "Allergic to Penicillin. History of asthma."; 

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group transition-colors hover:bg-white/[0.02]">
      <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black text-slate-300 border border-white/10 flex items-center justify-center font-bold text-lg shadow-lg group-hover:border-primary-500/30 transition-colors">
             {patientName.charAt(0)}
           </div>
           <div>
             <p className="font-bold text-slate-200 text-lg group-hover:text-primary-300 transition-colors">{patientName}</p>
             <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
               <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {formatDate(appointment.date)}</span>
               <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {formatTime(appointment.date)} ({appointment.duration} min)</span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {appointment.status === 'confirmed' && <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.1)]">CONFIRMED</span>}
           {appointment.status === 'cancelled' && <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-lg shadow-[0_0_10px_rgba(248,113,113,0.1)]">CANCELLED</span>}
           {appointment.status === 'completed' && <span className="text-xs font-bold text-slate-400 bg-slate-800/50 border border-slate-700 px-4 py-1.5 rounded-lg">COMPLETED</span>}
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2">
          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 ml-[68px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider flex items-center gap-2"><Activity className="w-3 h-3"/> Patient Notes</h4>
                    <p className="text-slate-300 text-sm p-3 rounded-xl bg-white/5 border border-white/5">{notes}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider flex items-center gap-2"><Zap className="w-3 h-3"/> Appointment Reason</h4>
                    <p className="text-slate-300 text-sm p-3 rounded-xl bg-white/5 border border-white/5">{appointment.notes || "No specific reason provided."}</p>
                </div>
            </div>
            
            {appointment.status === 'confirmed' && (
              <div className="flex gap-3 mt-6 justify-end">
                <button className="text-xs font-bold bg-transparent border border-white/10 text-slate-400 px-4 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-all">Cancel Booking</button>
                <button className="text-xs font-bold bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all">Mark Completed</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDashboard;