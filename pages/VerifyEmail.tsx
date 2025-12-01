import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
      
      <div className="w-full max-w-md m-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/5 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Mail className="w-10 h-10 text-primary-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">Check Your Inbox</h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            We have sent you a verification email. Please verify your email address to secure your account and then log in.
          </p>

          <Link 
            to="/"
            className="w-full inline-flex justify-center items-center py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform active:scale-[0.98] border border-white/10"
          >
            Back to Sign In <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;