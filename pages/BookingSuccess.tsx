import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { formatDate, formatTime } from '../utils';
import { CheckCircle, CreditCard, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const BookingSuccess: React.FC = () => {
  const { markAppointmentAsPaid } = useStore();
  const location = useLocation();
  const state = location.state as { appointmentId: string; doctorName: string; date: Date | string; duration: number } | null;
  
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'paid'>('idle');

  // If accessed directly without state, show generic message
  const doctorName = state?.doctorName || 'Your Doctor';
  const date = state?.date ? new Date(state.date) : new Date();

  const handlePayment = () => {
    if (!state?.appointmentId) return;
    setPaymentStatus('processing');
    setTimeout(() => {
      markAppointmentAsPaid(state.appointmentId);
      setPaymentStatus('paid');
    }, 2000);
  };

  if (!state) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="glass-card p-12 rounded-3xl text-center border border-white/5">
                <p className="text-slate-400 text-lg mb-4">Invalid booking session.</p>
                <Link to="/patient" className="text-primary-400 font-bold hover:text-primary-300">Go Home</Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-lg w-full glass-card rounded-[40px] shadow-2xl overflow-hidden border border-white/5 relative">
        {/* Top Gradient */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${paymentStatus === 'paid' ? 'from-green-500 to-emerald-500' : 'from-amber-500 to-orange-500'}`}></div>

        <div className="p-10 text-center relative z-10">
          <div className={`w-20 h-20 ${paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-amber-500/20 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500`}>
            {paymentStatus === 'paid' ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {paymentStatus === 'paid' ? 'Booking Confirmed!' : 'Booking Pending'}
          </h1>
          <p className="text-slate-400">
             {paymentStatus === 'paid' ? 'Your appointment has been scheduled successfully.' : 'Please complete payment to confirm your slot.'}
          </p>
        </div>

        <div className="px-10 pb-10 space-y-8">
          <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-2">Appointment Details</h3>
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Specialist</span>
                <span className="font-bold text-slate-200">{doctorName}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Date & Time</span>
                <div className="text-right">
                    <p className="font-bold text-slate-200">{formatDate(date)}</p>
                    <p className="text-xs text-slate-500">{formatTime(date)} (EST)</p>
                </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="pt-2">
            {paymentStatus === 'paid' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in zoom-in-95">
                <div className="bg-green-500/20 p-2.5 rounded-full text-green-400">
                   <ShieldCheck className="w-6 h-6"/>
                </div>
                <div>
                   <p className="font-bold text-white">Payment Successful</p>
                   <p className="text-xs text-green-400/80">Receipt sent to your email.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="font-medium text-slate-400">Total Due</span>
                  <span className="text-3xl font-bold text-white">$50.00</span>
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                  className="w-full py-4 bg-[#635bff] hover:bg-[#544ee3] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,91,255,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" /> Pay Now
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 opacity-70">
                  <ShieldCheck className="w-3 h-3"/> Secure payment via Stripe
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 text-center">
             {paymentStatus === 'paid' && (
                <Link to="/patient" className="inline-flex items-center text-slate-400 hover:text-white font-bold transition-colors">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;