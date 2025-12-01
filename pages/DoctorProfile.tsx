import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { TimeSlot } from '../types';
import { generateSlotsForDate, formatDate, formatTime } from '../utils';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle, GraduationCap, MapPin, Award, ArrowLeft } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctors, bookAppointment, user } = useStore();
  const navigate = useNavigate();

  const doctor = doctors.find(d => d.id === id);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (doctor) {
      const slots = generateSlotsForDate(selectedDate, duration);
      setAvailableSlots(slots);
      setSelectedSlot(null);
    }
  }, [selectedDate, duration, doctor]);

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= new Date(new Date().setHours(0,0,0,0))) {
        setSelectedDate(prev);
    }
  };

  const handleConfirmBooking = () => {
    if (doctor && selectedSlot && user) {
      const apptId = bookAppointment({
        patientId: user.id,
        doctorId: doctor.id,
        date: selectedSlot.start.toISOString(),
        duration: duration,
        notes: 'Requested via online portal'
      });
      navigate('/patient/booking-success', { 
        state: { 
          appointmentId: apptId,
          doctorName: doctor.name, 
          date: selectedSlot.start, 
          duration 
        } 
      });
    }
  };

  if (!doctor) return <div className="p-10 text-center text-slate-500">Doctor not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/patient/book')}
        className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to specialists
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Doctor Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[32px] p-8 text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-900/30 to-transparent"></div>
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                 <div className="absolute inset-0 bg-primary-600 rounded-full blur-2xl opacity-20"></div>
                 <img 
                    src={doctor.avatar} 
                    alt={doctor.name} 
                    className="w-32 h-32 rounded-3xl object-cover border-2 border-white/10 shadow-2xl relative z-10" 
                 />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{doctor.name}</h1>
              <p className="text-primary-400 font-bold text-sm uppercase tracking-wider mb-6">{doctor.specialty}</p>
              
              <div className="flex justify-center gap-3 mb-8">
                <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs font-bold border border-white/5">
                  15+ Years Exp.
                </span>
                <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs font-bold border border-white/5">
                  Highly Rated
                </span>
              </div>

              <div className="text-left space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <GraduationCap className="w-5 h-5 text-slate-500 shrink-0" />
                  <p>MD from Harvard Medical School, Residency at Johns Hopkins.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Award className="w-5 h-5 text-slate-500 shrink-0" />
                  <p>Board Certified in {doctor.specialty}, Member of AMA.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                  <p>Available at VitalCare Main Clinic (Video consultations available).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-8 border border-white/5">
            <h3 className="font-bold text-white mb-4 text-lg">About Dr. {doctor.name.split(' ')[1]}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{doctor.bio}</p>
          </div>
        </div>

        {/* Right Column: Booking Calendar */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-white/5 bg-black/20">
              <h2 className="text-2xl font-bold text-white">Select Availability</h2>
              <p className="text-slate-500 text-sm mt-1">Times are shown in your local timezone.</p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <button onClick={() => setDuration(30)} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${duration === 30 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>30 min</button>
                  <button onClick={() => setDuration(60)} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${duration === 60 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>60 min</button>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-2 py-1.5">
                  <button onClick={handlePrevDay} className="p-2.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="flex items-center gap-2 px-2 min-w-[140px] justify-center">
                    <CalendarIcon className="w-4 h-4 text-primary-400" />
                    <span className="font-bold text-slate-200">{formatDate(selectedDate)}</span>
                  </div>
                  <button onClick={handleNextDay} className="p-2.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="flex-1 min-h-[300px]">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-6 tracking-widest">Available Slots</h3>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group ${
                          selectedSlot === slot
                            ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:border-primary-500/50 hover:text-primary-300 hover:bg-white/10'
                        }`}
                      >
                         {selectedSlot === slot && <div className="absolute inset-0 bg-white/20 blur-md"></div>}
                        <span className="relative z-10">{formatTime(slot.start)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <Clock className="w-10 h-10 text-slate-600 mb-3" />
                    <p className="text-slate-500 font-bold">No slots available for this date.</p>
                    <button onClick={handleNextDay} className="mt-2 text-primary-400 text-sm font-semibold hover:text-primary-300 transition-colors">Check next day</button>
                  </div>
                )}
              </div>

              {/* Footer Action */}
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
                <button
                  disabled={!selectedSlot}
                  onClick={() => setShowConfirmModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] disabled:shadow-none"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmModal && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            
            <h3 className="text-2xl font-bold text-white mb-6">Review Appointment</h3>
            
            <div className="space-y-4 mb-8 bg-black/20 p-6 rounded-2xl border border-white/5">
               <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-slate-400 text-sm">Doctor</span>
                 <span className="font-bold text-slate-200">{doctor.name}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-slate-400 text-sm">Date</span>
                 <span className="font-bold text-slate-200">{formatDate(selectedSlot.start)}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-slate-400 text-sm">Time</span>
                 <span className="font-bold text-slate-200">{formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-slate-400 text-sm">Duration</span>
                 <span className="font-bold text-slate-200">{duration} Minutes</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                 <span className="text-slate-400 text-sm">Consultation Fee</span>
                 <span className="text-xl font-bold text-white">$50.00</span>
               </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3.5 text-slate-400 font-bold hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBooking}
                className="flex-1 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;