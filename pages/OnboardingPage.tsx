
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../context/UserContext';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification, updateProfile } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString(36).substring(7));
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: '',
    studyLevel: '',
    otherStudyLevel: '',
    interests: [] as string[],
    customInterest: ''
  });

  const avatarUrl = useMemo(() => 
    `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`, 
  [avatarSeed]);

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const addCustomInterest = () => {
    if (formData.customInterest.trim() && !formData.interests.includes(formData.customInterest.trim())) {
      setFormData({ 
        ...formData, 
        interests: [...formData.interests, formData.customInterest.trim()],
        customInterest: ''
      });
      addNotification("Custom Node established.", "info");
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.fullName || !formData.email || !formData.password)) {
      addNotification("Please complete all identity fields.", "warning");
      return;
    }
    if (step === 2 && !formData.studyLevel) {
      addNotification("Please select your current academic status.", "warning");
      return;
    }
    if (step === 2 && formData.studyLevel === 'Other' && !formData.otherStudyLevel.trim()) {
      addNotification("Please specify your current track.", "warning");
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = async () => {
    if (formData.interests.length < 1) {
      addNotification("Please select at least 1 focus area.", "info");
      return;
    }
    
    setIsLoading(true);
    try {
      const finalStudyLevel = formData.studyLevel === 'Other' ? formData.otherStudyLevel : formData.studyLevel;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            location: formData.location,
            study_level: finalStudyLevel,
            interests: formData.interests,
            xp: 0,
            level: 1,
            avatar: avatarUrl,
            saved_event_ids: [],
            registered_event_ids: []
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        addNotification(`Profile established. Welcome, ${formData.fullName}.`, "success");
        // Ensure the global user context has the latest local meta
        updateProfile({
            name: formData.fullName,
            avatar: avatarUrl,
            interests: formData.interests,
            role: finalStudyLevel as any
        });
        setTimeout(() => navigate('/'), 1000);
      } else {
        setIsSuccess(true);
      }
    } catch (error: any) {
      addNotification(error.message || "Ecosystem sync failed.", "warning");
      setIsLoading(false);
    }
  };

  const interestCategories = [
    { name: 'Engineering Focus Areas', items: ['AI', 'Web Development', 'Cybersecurity', 'Robotics', 'Quantum Computing'], colSpan: 'col-span-1' },
    { name: 'Creative Focus Areas', items: ['UX Design', 'Branding', 'Product Strategy', 'Digital Media'], colSpan: 'col-span-1' },
    { name: 'Business Focus Areas', items: ['Entrepreneurship', 'Fintech', 'Growth Marketing', 'Venture Capital'], colSpan: 'col-span-2' }
  ];

  const academicTracks = [
    { id: 'High School', name: 'Secondary', icon: 'ph ph-book-open', desc: 'Pre-university exploration' },
    { id: 'University', name: 'Undergraduate', icon: 'ph ph-student', desc: 'Higher education specialization' },
    { id: 'Professional', name: 'Alumni / Pro', icon: 'ph ph-briefcase', desc: 'Career-focused trajectory' },
    { id: 'Other', name: 'Other Track', icon: 'ph ph-plus-circle', desc: 'Define your unique path' }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-main-light dark:bg-main-dark text-primary-light dark:text-primary-dark flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="size-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-10 border border-subtle-light dark:border-subtle-dark shadow-xl">
           <i className="ph ph-envelope-open text-4xl"></i>
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Verification Sent</h1>
        <p className="text-secondary-light dark:text-secondary-dark max-w-md mb-12 leading-relaxed font-medium">
          A verification link has been sent to <span className="font-bold text-primary-light dark:text-primary-dark">{formData.email}</span>. Please authorize your profile to continue.
        </p>
        <Link to="/login" className="btn-primary px-12 py-4 shadow-2xl">Return to Portal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-light dark:bg-main-dark text-primary-light dark:text-primary-dark flex flex-col font-sans theme-transition">
      <header className="px-6 sm:px-12 py-6 flex justify-between items-center bg-main-light/80 dark:bg-main-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-subtle-light dark:border-subtle-dark">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-8 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i className="ph ph-briefcase font-bold text-xl"></i>
          </div>
          <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">SmartEdu</h2>
        </Link>
        
        <div className="hidden sm:flex items-center gap-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`size-8 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-300 ${
                step === s ? 'stepper-active bg-primary text-white shadow-lg' : 
                step > s ? 'bg-primary/10 text-primary' : 
                'bg-elevated-light dark:bg-elevated-dark text-secondary-light/20 dark:text-secondary-dark/20'
              }`}>
                {step > s ? <i className="ph ph-check"></i> : s}
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-primary-light dark:text-primary-dark' : 'text-secondary-light/20 dark:text-secondary-dark/20'}`}>
                {s === 1 && "Identity"}
                {s === 2 && "Context"}
                {s === 3 && "Focus"}
              </p>
            </div>
          ))}
        </div>

        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-secondary-light/40 dark:text-secondary-dark/40 hover:text-primary transition-colors">Abort</Link>
      </header>

      <main className="flex-1 flex flex-col items-center py-16 px-6">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
             <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">
                {step === 1 && "Create Identity"}
                {step === 2 && "Academic Track"}
                {step === 3 && "Ecosystem Focus"}
             </h1>
             <p className="text-secondary-light dark:text-secondary-dark font-medium max-w-lg mx-auto leading-relaxed text-base">
                {step === 1 && "Establish your professional identifier within the network."}
                {step === 2 && "Help us personalize your trajectory based on your current status."}
                {step === 3 && "Select the focus areas you want SmartEdu to prioritize for you."}
             </p>
          </div>

          <div className="prof-card p-8 sm:p-12 relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5">
            {isLoading && (
              <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center">
                <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Establishing Profile</p>
              </div>
            )}

            <div className="space-y-10">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                  <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-main-light/50 dark:bg-main-dark/30 rounded-3xl border border-subtle-light dark:border-subtle-dark">
                    <div className="relative group">
                      <div className="size-32 rounded-2xl bg-white dark:bg-slate-900 border border-subtle-light dark:border-subtle-dark overflow-hidden p-2 shadow-xl">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                      </div>
                      <button 
                        onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
                        className="absolute -bottom-3 -right-3 size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-surface-light dark:border-slate-800"
                        title="Randomize Identity"
                      >
                        <i className="ph ph-arrows-clockwise text-xl"></i>
                      </button>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <h3 className="font-black text-[10px] text-primary uppercase tracking-widest">Profile Signature</h3>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark font-medium leading-relaxed">
                        Refresh your avatar until it aligns with your professional identity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1">Full Name</label>
                      <input type="text" className="w-full py-4 px-6 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-subtle-light dark:border-subtle-dark" placeholder="Alex Rivera" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1">Institutional Email</label>
                      <input type="email" className="w-full py-4 px-6 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-subtle-light dark:border-subtle-dark" placeholder="alex@domain.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1">Security Key</label>
                      <input type="password" minLength={6} className="w-full py-4 px-6 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-subtle-light dark:border-subtle-dark" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                   <div className="space-y-4">
                    <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1">Ecosystem Hub</label>
                    <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full py-4 px-6 text-sm font-bold appearance-none cursor-pointer text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border-subtle-light dark:border-subtle-dark">
                        <option value="">Select your Hub Location</option>
                        <option>Americas</option>
                        <option>Europe</option>
                        <option>Asia-Pacific</option>
                        <option>Middle East & Africa</option>
                    </select>
                  </div>
                  
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1">Current Track</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {academicTracks.map(track => (
                        <button 
                          key={track.id} 
                          onClick={() => setFormData({...formData, studyLevel: track.id})} 
                          className={`flex flex-col items-center gap-6 p-8 rounded-3xl border-2 transition-all ${
                            formData.studyLevel === track.id 
                            ? 'border-primary bg-primary/5 text-slate-900 dark:text-white shadow-xl' 
                            : 'border-transparent bg-slate-50 dark:bg-slate-900 text-secondary-light/30 dark:text-secondary-dark/30 hover:border-primary/20'
                          }`}
                        >
                          <div className={`size-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                            formData.studyLevel === track.id ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'
                          }`}>
                            <i className={track.icon}></i>
                          </div>
                          <div className="text-center">
                            <p className="font-black text-[11px] uppercase tracking-widest mb-2">{track.name}</p>
                            <p className="text-[9px] opacity-60 font-bold leading-tight">{track.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {formData.studyLevel === 'Other' && (
                      <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-subtle-light dark:border-subtle-dark animate-in zoom-in-95">
                         <label className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-1 block mb-3">Please specify your unique path</label>
                         <input 
                          type="text" 
                          placeholder="e.g. Researcher, PhD Scholar, Freelance Strategist..." 
                          value={formData.otherStudyLevel}
                          onChange={e => setFormData({...formData, otherStudyLevel: e.target.value})}
                          className="w-full py-4 px-6 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950 border-subtle-light dark:border-subtle-dark"
                         />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {interestCategories.map((cat) => (
                      <div key={cat.name} className={`${cat.colSpan} space-y-6`}>
                        <h3 className="text-[11px] font-black text-secondary-light dark:text-secondary-dark uppercase tracking-widest px-1">
                          {cat.name}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {cat.items.map(item => {
                            const selected = formData.interests.includes(item);
                            return (
                              <button 
                                key={item} 
                                onClick={() => toggleInterest(item)}
                                className={`chip-base ${selected ? 'chip-selected' : 'chip-unselected'}`}
                              >
                                {selected && <i className="ph ph-check text-base"></i>}
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-subtle-light dark:border-subtle-dark flex flex-col sm:flex-row justify-between items-center gap-8">
              <button 
                onClick={prevStep} 
                disabled={step === 1 || isLoading} 
                className={`w-full sm:w-auto text-secondary-light/40 dark:text-secondary-dark/40 hover:text-primary font-black text-[10px] uppercase tracking-widest disabled:opacity-0 flex items-center justify-center gap-3 transition-all order-2 sm:order-1`}
              >
                <i className="ph ph-arrow-left text-lg"></i> Previous
              </button>
              <button 
                onClick={step === 3 ? handleComplete : nextStep} 
                disabled={isLoading || (step === 3 && formData.interests.length < 1)} 
                className={`w-full sm:w-auto px-12 py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-4 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-widest order-1 sm:order-2 disabled:opacity-30 disabled:grayscale disabled:scale-100`}
              >
                {step === 3 ? 'Finalize Profile' : 'Continue'}
                <i className={`ph ${step === 3 ? 'ph-rocket-launch' : 'ph-arrow-right'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
