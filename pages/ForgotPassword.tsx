import React, { useState } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setIsSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-accent-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>

      <div className="w-full max-w-md m-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/5">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 text-sm transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>

            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-500/20 to-primary-500/20 text-accent-400 mb-4 ring-1 ring-white/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <KeyRound className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
                <p className="text-slate-400 mt-2 text-sm">Enter your email to receive a reset link</p>
            </div>

            {isSent ? (
            <div className="text-center animate-in fade-in zoom-in-95">
                <div className="bg-green-500/10 text-green-400 p-6 rounded-2xl border border-green-500/20 mb-8 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <div className="flex justify-center mb-3">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <p className="font-bold text-lg mb-1">Reset Link Sent!</p>
                <p className="text-sm opacity-80">We sent you a password change link to <br/><span className="font-bold text-white">{email}</span></p>
                </div>
                <Link 
                to="/" 
                className="w-full inline-block py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-white/10 transition-colors"
                >
                Back to Sign In
                </Link>
            </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    {error}
                  </div>
                )}
                
                <div className="glass-input-wrapper group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium"
                    placeholder="Email"
                    required
                    autoComplete="off"
                  />
                  <label htmlFor="email" className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm">
                    Email Address
                  </label>
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center border border-white/10"
                >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Reset Link'}
                </button>
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;