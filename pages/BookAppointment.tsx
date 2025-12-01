import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Stethoscope } from 'lucide-react';

const BookAppointment: React.FC = () => {
  const { doctors } = useStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Find a Specialist</h1>
           <p className="text-slate-400 text-lg">Access world-class care from our network.</p>
        </div>
        
        {/* Search Bar - Glassy */}
        <div className="glass-input-wrapper w-full md:w-auto min-w-[320px]">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Search specialty or name..." 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5 group-focus-within:text-primary-400 transition-colors" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map(doc => (
          <div 
            key={doc.id}
            className="group glass-card rounded-[32px] overflow-hidden transition-all duration-300 flex flex-col relative border border-white/5 hover:border-primary-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-slate-900/40 hover:-translate-y-1"
          >
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="p-8 flex-1 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img 
                    src={doc.avatar} 
                    alt={doc.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 group-hover:border-primary-500 transition-colors relative z-10 shadow-2xl" 
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 shadow-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span>4.9</span>
                </div>
              </div>
              
              <h3 className="font-bold text-2xl text-white mb-1 group-hover:text-primary-300 transition-colors">{doc.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                 <Stethoscope className="w-3.5 h-3.5 text-primary-400" />
                 <p className="text-primary-400 font-bold text-xs uppercase tracking-widest">{doc.specialty}</p>
              </div>
              
              <p className="text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed border-t border-white/5 pt-4">
                {doc.bio}
              </p>

              <div className="flex flex-col gap-2">
                 {[
                   "Video Consultation Available",
                   "Accepts New Patients",
                   "Usually responds in 1hr"
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_5px_#06b6d4]"></div>
                      {feat}
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-4 m-4 mt-0 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-primary-600/10 group-hover:border-primary-500/20 transition-colors">
              <button 
                onClick={() => navigate(`/patient/book/${doc.id}`)}
                className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-bold transition-all duration-300 group-hover:gap-3"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;