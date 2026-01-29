
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../context/UserContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      addNotification(`Neural match confirmed.`, 'success');
      navigate('/');
    } catch (error: any) {
      setErrorMsg("Neural credentials do not match. Use Demo Mode for testing.");
      addNotification("Authentication Exception.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateDemoMode = (role: UserRole = UserRole.STUDENT) => {
    // Immediate state hydration for demonstration
    updateProfile({
      name: role === UserRole.ADMIN ? 'Institutional Overseer' : 'Demo Innovator',
      role: role,
      interests: ['AI', 'UX Engineering', 'Fintech'],
      avatar: role === UserRole.ADMIN 
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=admin-hub' 
        : 'https://api.dicebear.com/7.x/bottts/svg?seed=demo-innovator'
    });
    
    addNotification(`${role === UserRole.ADMIN ? 'Institute' : 'Student'} demo authorized. Cloud sync simulated.`, "success");
    
    if (role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-main-light dark:bg-main-dark flex flex-col md:flex-row font-sans">
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden items-center justify-center p-20">
        <div className="relative z-10 text-center space-y-8">
          <div className="size-24 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
            <i className="ph ph-briefcase text-white text-5xl"></i>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">SmartEdu Portal</h1>
          <p className="text-white/70 max-w-sm mx-auto leading-relaxed font-medium">Re-authorize your professional trajectory and resume your evolution.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Access Portal</h2>
            <p className="text-secondary-light dark:text-secondary-dark font-medium">Authentication required to initiate secure session.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in">
               <i className="ph ph-warning-circle text-rose-500 text-xl"></i>
               <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary-light/40 uppercase tracking-widest px-1">Institutional ID</label>
              <input 
                type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-elevated-light dark:bg-slate-900 py-4 px-6 rounded-2xl font-bold"
                placeholder="alex@smartedu.io"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary-light/40 uppercase tracking-widest px-1">Security Key</label>
              <input 
                type="password" required value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-elevated-light dark:bg-slate-900 py-4 px-6 rounded-2xl font-bold"
                placeholder="••••••••"
              />
            </div>
            <button disabled={isLoading} className="btn-primary w-full py-5 text-[10px] uppercase tracking-widest shadow-2xl">
              {isLoading ? 'Validating...' : 'Initiate Session'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-secondary-light/20"><div className="h-px flex-1 bg-current" /><span>DEMO ACCESS</span><div className="h-px flex-1 bg-current" /></div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => initiateDemoMode(UserRole.ADMIN)} className="w-full py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:brightness-125 transition-all shadow-xl flex items-center justify-center gap-3 border border-white/5">
                <i className="ph ph-shield-check text-xl text-primary"></i>
                Institute Access Demo
              </button>
              <button onClick={() => initiateDemoMode(UserRole.STUDENT)} className="w-full py-4 border-2 border-dashed border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary/5 transition-all">
                Student Portal Demo
              </button>
            </div>
          </div>

          <p className="text-center text-secondary-light/60 text-sm font-medium">Newcomer? <Link to="/onboarding" className="text-primary font-black">Establish Identity</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
