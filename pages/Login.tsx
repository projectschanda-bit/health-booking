import React, { useState } from 'react';
import { useStore } from '../store';
import { Role } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Stethoscope, ArrowRight, Check, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loginWithGoogle } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password, role);
      if (role === 'patient') navigate('/patient');
      if (role === 'doctor') navigate('/doctor');
      if (role === 'admin') navigate('/admin');
    } catch (err: any) {
      if (err.message === 'email-not-verified') {
        navigate('/verify-email');
        return;
      }
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userRole = await loginWithGoogle();
      if (userRole === 'patient') navigate('/patient');
      if (userRole === 'doctor') navigate('/doctor');
      if (userRole === 'admin') navigate('/admin');
    } catch (err) {
      setError('Google sign in failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans selection:bg-primary-500/30 selection:text-primary-200">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl m-4 flex flex-col lg:flex-row relative z-10 transition-all duration-500 animate-in fade-in zoom-in-95">
        
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="hidden lg:flex w-5/12 p-12 flex-col justify-between relative">
           {/* Glass Card Background for Left Side Only */}
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl -z-10"></div>

           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 ring-1 ring-white/20">
                    <Stethoscope className="w-6 h-6 text-white" />
                 </div>
                 <span className="text-xl font-bold tracking-tight text-white">VitalCare</span>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                  <h1 className="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                    Move Fast.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      Heal Faster.
                    </span>
                  </h1>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-sm">
                    Experience the future of healthcare scheduling. Seamless, secure, and smart.
                  </p>

                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default group">
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform group-hover:text-primary-300 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">Instant Sync</p>
                            <p className="text-xs text-slate-500 group-hover:text-slate-400">Real-time calendar integration.</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default group">
                        <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-110 transition-transform group-hover:text-accent-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">AI Diagnostics</p>
                            <p className="text-xs text-slate-500 group-hover:text-slate-400">Smart health tracking features.</p>
                        </div>
                     </div>
                  </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                 <p className="text-xs text-slate-500">Trusted by 10,000+ medical professionals.</p>
              </div>
           </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
           
           <div className="max-w-md mx-auto w-full">
             <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm">
                  Access your dashboard. <Link to="/register" className="text-primary-400 font-semibold cursor-pointer hover:text-primary-300 transition-colors hover:underline decoration-primary-500/50 underline-offset-4">Create account</Link>
                </p>
             </div>

             {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  {error}
                </div>
             )}

             <form onSubmit={handleLogin} className="space-y-8">
                
                {/* Role Switcher - Glassy */}
                <div className="p-1.5 bg-slate-900/50 backdrop-blur-md rounded-xl flex border border-white/10 shadow-inner">
                    {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg capitalize transition-all duration-300 ${
                          role === r
                            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/20'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                </div>

                <div className="space-y-6">
                  {/* Glass Input: Email */}
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
                    <label 
                      htmlFor="email" 
                      className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Glass Input: Password */}
                  <div className="glass-input-wrapper group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium pr-12"
                      placeholder="Password"
                      required
                    />
                    <label 
                      htmlFor="password" 
                      className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-primary-400 transition-colors z-20"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link to="/forgot-password" state={{ email }} className="text-xs font-semibold text-primary-400 hover:text-primary-300 hover:underline decoration-primary-500/50 underline-offset-4 transition-all">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 border border-white/10 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                    <span className="relative flex items-center gap-2">
                        {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                        <>
                            Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                        )}
                    </span>
                  </button>
                </div>
             </form>

             <div className="my-10 relative flex justify-center text-sm">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative z-10 px-4 bg-[#020204] text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Or continue with
                </span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  type="button" 
                  className="flex items-center justify-center px-4 py-3.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-slate-300 text-sm font-semibold gap-3 group"
                >
                   <svg className="grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                   </svg>
                   Google
                </button>
                <button 
                  type="button" 
                  className="flex items-center justify-center px-4 py-3.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-slate-300 text-sm font-semibold gap-3 group"
                >
                  <svg className="text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 384 512" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                  </svg>
                  Apple
                </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;