
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, updatePreferences, addNotification } = useUser();
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    bio: user.bio || '',
    avatar: user.avatar
  });

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    addNotification("Neural identity synced with institutional record.", "success");
  };

  const togglePref = (key: keyof typeof user.preferences) => {
    updatePreferences({ [key]: !user.preferences[key] });
  };

  const handlePurge = () => {
    if (window.confirm("CRITICAL: This will purge all local identity caches. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="space-y-12 pb-24 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
              <i className="ph ph-shield-check"></i> Authorized Session
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Ecosystem Preps</h1>
            <p className="text-secondary-light dark:text-secondary-dark font-medium max-w-md leading-relaxed">
              Manage your verified career identity and neural platform synchronization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Identity Section */}
          <div className="lg:col-span-7 space-y-10">
            <section className="p-8 md:p-12 prof-card border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <i className="ph ph-user-focus text-9xl"></i>
              </div>
              
              <div className="flex items-center gap-4 mb-10 border-b border-subtle-light dark:border-subtle-dark pb-6">
                 <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                   <i className="ph ph-identification-card text-2xl"></i>
                 </div>
                 <div>
                   <h2 className="text-xl font-black tracking-tight">Identity Signature</h2>
                   <p className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest">Global Profile ID: {user.id?.substring(0, 8) || 'GUEST'}</p>
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-subtle-light dark:border-subtle-dark">
                   <div className="relative group">
                      <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 p-1.5 border border-subtle-light dark:border-subtle-dark shadow-xl overflow-hidden">
                        <img src={profileForm.avatar} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="Identity" />
                      </div>
                      <button 
                        onClick={() => setProfileForm({ ...profileForm, avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substr(7)}` })}
                        className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
                        title="Randomize Signature"
                      >
                         <i className="ph ph-arrows-clockwise text-xl font-bold"></i>
                      </button>
                   </div>
                   <div className="text-center sm:text-left space-y-2">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Institutional Node</p>
                      <p className="text-lg font-black">{user.role || 'Innovator'} • Level {user.level}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Established: {new Date().getFullYear()} Season</p>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Designation Label</label>
                    <div className="relative">
                       <i className="ph ph-user absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40"></i>
                       <input 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Alex Rivera"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Professional Tagline</label>
                    <div className="relative">
                       <i className="ph ph-quotes absolute left-5 top-5 text-primary opacity-40"></i>
                       <textarea 
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none min-h-[140px] resize-none leading-relaxed"
                        placeholder="Define your career focus areas and institutional impact targets..."
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSaveProfile}
                    className="btn-primary w-full py-5 text-[10px] uppercase tracking-[0.3em] shadow-2xl"
                  >
                    <i className="ph ph-cloud-arrow-up text-xl"></i> Sync Signature Record
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Preferences Section */}
          <div className="lg:col-span-5 space-y-10">
            <section className="p-8 md:p-10 prof-card border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-10 border-b border-subtle-light dark:border-subtle-dark pb-6">
                 <div className="size-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                    <i className="ph ph-sliders text-2xl"></i>
                 </div>
                 <div>
                    <h2 className="text-xl font-black tracking-tight">Ecosystem Prefs</h2>
                    <p className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest">Platform Behavior Nodes</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { id: 'notificationsEnabled', label: 'Push Hub Alerts', desc: 'Real-time synergy & event notifications.', icon: 'ph ph-bell-ringing' },
                   { id: 'publicProfile', label: 'Ecosystem Visibility', desc: 'Allow institutional partners to discover node.', icon: 'ph ph-broadcast' },
                   { id: 'compactMode', label: 'Neural Density Mode', desc: 'Reduce visual latency in data views.', icon: 'ph ph-rows' }
                 ].map((pref) => (
                   <div key={pref.id} className="flex items-center justify-between group py-2">
                      <div className="flex items-center gap-4">
                         <div className={`size-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-inner ${
                           user.preferences[pref.id as keyof typeof user.preferences] 
                           ? 'bg-primary text-white' 
                           : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-primary'
                         }`}>
                            <i className={pref.icon}></i>
                         </div>
                         <div>
                            <p className="text-xs font-black group-hover:text-primary transition-colors">{pref.label}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{pref.desc}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => togglePref(pref.id as any)}
                        className={`w-14 h-8 rounded-full flex items-center p-1 transition-all duration-300 ${
                          user.preferences[pref.id as keyof typeof user.preferences] 
                          ? 'bg-primary' 
                          : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                         <div className={`size-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                           user.preferences[pref.id as keyof typeof user.preferences] ? 'translate-x-6' : 'translate-x-0'
                         }`} />
                      </button>
                   </div>
                 ))}
              </div>

              <div className="mt-12 pt-8 border-t border-subtle-light dark:border-subtle-dark space-y-4">
                 <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-subtle-light dark:border-subtle-dark flex items-center justify-center gap-3">
                    <i className="ph ph-keyhole text-lg"></i> Re-authorize Security
                 </button>
              </div>
            </section>

            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <div className="flex items-center gap-3 mb-4">
                  <i className="ph ph-warning-octagon text-rose-500 text-2xl"></i>
                  <h3 className="text-lg font-black">Maintenance Protocol</h3>
               </div>
               <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium">Resetting profile caches will clear temporary session data and re-sync with the institutional cloud node.</p>
               <div className="space-y-3">
                  <button onClick={handlePurge} className="w-full py-4 bg-rose-500/10 text-rose-500 font-black rounded-xl text-[9px] uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                    Purge All Local Hub Data
                  </button>
                  <button onClick={() => window.open('https://smartedu.io/docs', '_blank')} className="w-full py-4 bg-white/5 text-white/40 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                    Access Manuals
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
