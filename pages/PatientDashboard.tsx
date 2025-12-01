import React from 'react';
import { useStore } from '../store';
import { formatDate, formatTime } from '../utils';
import { Calendar, Clock, ArrowRight, FileText, User, AlertCircle, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { user, appointments, doctors } = useStore();
  
  const myAppointments = appointments
    .filter(a => a.patientId === user?.id && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Only count confirmed appointments for the "Upcoming" hero card
  const upcomingAppt = myAppointments.find(a => new Date(a.date) > new Date() && a.status === 'confirmed');

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">{user?.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400 text-lg">Here's your health overview for today.</p>
        </div>
        <Link to="/patient/book" className="inline-flex bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all items-center gap-3 transform hover:-translate-y-1 shadow-lg group">
           <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-1 group-hover:shadow-neon transition-shadow">
             <Calendar className="w-4 h-4" /> 
           </div>
           <span>Book Appointment</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Next Session Card - Styled like "Pricing" Card */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden group border border-white/5 transition-all duration-500 hover:border-primary-500/30">
           {/* Glow Effect */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-500 group-hover:bg-primary-600/20"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
                <div className="flex items-center gap-3 mb-8">
                    <span className="px-3 py-1 bg-primary-950/50 text-primary-300 rounded-lg text-xs font-bold border border-primary-500/20 uppercase tracking-widest shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    Up Next
                    </span>
                    {upcomingAppt && <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>}
                </div>

                {upcomingAppt ? (
                <>
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter shadow-black drop-shadow-lg">
                            {formatTime(upcomingAppt.date).replace(/AM|PM/, '')}
                        </span>
                        <span className="text-xl md:text-2xl text-slate-500 font-medium">
                            {formatTime(upcomingAppt.date).slice(-2)} EST
                        </span>
                    </div>
                    <p className="text-slate-400 mb-8 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent-400" />
                        {formatDate(upcomingAppt.date)}
                    </p>
                    
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <img 
                                src={doctors.find(d => d.id === upcomingAppt.doctorId)?.avatar} 
                                className="w-12 h-12 rounded-full border-2 border-primary-500/30 object-cover"
                            />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Specialist</p>
                                <p className="font-bold text-slate-100 text-lg">
                                    {doctors.find(d => d.id === upcomingAppt.doctorId)?.name || 'Unknown Doctor'}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
                ) : (
                <div className="py-12">
                    <p className="text-3xl font-bold text-white mb-3">Clear Schedule</p>
                    <p className="text-slate-400 mb-8 max-w-md">You have no upcoming appointments. Stay proactive with your health checkups.</p>
                </div>
                )}
             </div>

             <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <Link to={upcomingAppt ? "/patient/book" : "/patient/book"} className="text-white font-bold flex items-center gap-2 group-hover:text-primary-300 transition-colors">
                  {upcomingAppt ? 'Manage Session' : 'Find a Doctor'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
           </div>
        </div>

        {/* Medical Notes / Quick Info - Styled like "Sync Profiles" Card */}
        <div className="glass-card p-8 rounded-[32px] flex flex-col relative overflow-hidden border border-white/5 hover:border-accent-500/30 transition-all duration-500 group">
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-accent-500/20 transition-all"></div>
          
          <div className="mb-6 flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center text-accent-400 shadow-lg">
                  <FileText className="w-6 h-6"/>
              </div>
              <div className="px-2 py-1 rounded bg-accent-950/30 border border-accent-900/50">
                  <Zap className="w-4 h-4 text-accent-400 fill-current" />
              </div>
          </div>
          
          <h3 className="font-bold text-2xl text-white mb-2">Medical Profile</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4">
              {user?.medicalNotes || 'Keep your medical history up to date for better diagnosis.'}
          </p>
          
          <div className="mt-auto">
            <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm text-slate-300 font-medium">Status</span>
                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3"/> Verified
                    </span>
                 </div>
                 <Link to="/patient/profile" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    Update Details
                 </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            Recent Activity
        </h3>
        <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
          {myAppointments.length > 0 ? (
            <div className="divide-y divide-white/5">
              {myAppointments.map(appt => {
                 const doctor = doctors.find(d => d.id === appt.doctorId);
                 return (
                  <div key={appt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/5 transition-colors gap-4 group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900/50 flex items-center justify-center text-slate-400 border border-white/10 shrink-0 shadow-lg group-hover:border-primary-500/30 transition-colors">
                         {doctor?.avatar ? <img src={doctor.avatar} className="w-full h-full rounded-2xl object-cover"/> : <User className="w-6 h-6"/>}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-100 mb-1 group-hover:text-primary-300 transition-colors">{doctor?.name}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {formatDate(appt.date)}</span>
                           <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatTime(appt.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`self-start sm:self-center px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${
                      appt.status === 'confirmed' ? 'bg-green-500/5 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.05)]' :
                      appt.status === 'completed' ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 
                      appt.status === 'pending' ? 'bg-amber-500/5 text-amber-400 border-amber-500/20' :
                      'bg-red-500/5 text-red-400 border-red-500/20'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                 );
              })}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 bg-white/5">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;