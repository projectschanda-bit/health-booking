import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const { register, loginWithGoogle } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/verify-email');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('User with this email already exists. Please sign in.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-lg m-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 text-primary-400 mb-4 ring-1 ring-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-slate-400 mt-2 text-sm">Join VitalCare for a healthier tomorrow</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
               <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="glass-input-wrapper group">
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium"
                placeholder="Full Name"
                required
                autoComplete="off"
              />
              <label htmlFor="name" className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm">
                Full Name
              </label>
            </div>

            <div className="glass-input-wrapper group">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium"
                placeholder="Email Address"
                required
                autoComplete="off"
              />
              <label htmlFor="email" className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm">
                Email Address
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="glass-input-wrapper group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium"
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="password" className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm">
                    Password
                  </label>
                </div>

                <div className="glass-input-wrapper group">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="glass-input-field w-full px-5 py-4 outline-none placeholder-transparent text-sm font-medium"
                    placeholder="Confirm"
                    required
                  />
                  <label htmlFor="confirmPassword" className="glass-input-label absolute left-5 top-4 text-slate-500 text-sm">
                    Confirm
                  </label>
                </div>
            </div>
            
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-primary-400 flex items-center gap-1 ml-1"
            >
                {showPassword ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 border border-white/10 group relative overflow-hidden mt-6"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
              <span className="relative flex items-center gap-2">
                 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="my-8 relative flex justify-center text-sm">
             <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10"></div>
             </div>
             <span className="relative z-10 px-4 bg-[#0a0a0c] text-slate-500 text-xs font-bold uppercase tracking-wider">
                Or continue with
             </span>
          </div>

          <button 
            onClick={handleGoogleLogin}
            type="button" 
            className="w-full py-3.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-slate-300 text-sm font-semibold gap-3 flex items-center justify-center group"
          >
            <svg className="grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            Google
          </button>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                  Already have an account? <Link to="/" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">Sign In</Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;