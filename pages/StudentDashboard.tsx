
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import { useUser } from '../context/UserContext';
import { SocialProfile, Experience } from '../types';
import { improveExperienceText } from '../services/geminiService';
import { InstitutionalLogo } from '../constants/Logos';
import { INITIAL_EVENTS } from './EventsPage';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, registeredEventIds, savedEventIds, updateSocialProfiles, updateExperience, addNotification } = useUser();
  
  const [editingExperience, setEditingExperience] = useState(false);
  const [tempExperience, setTempExperience] = useState<Experience[]>(user.experience || []);
  const [improvingId, setImprovingId] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);

  const savedEventsList = useMemo(() => {
    return INITIAL_EVENTS.filter(e => savedEventIds.includes(e.id));
  }, [savedEventIds]);

  const saveExperience = () => {
    updateExperience(tempExperience);
    setEditingExperience(false);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      role: '',
      duration: '',
      description: '',
      domain: ''
    };
    setTempExperience([...tempExperience, newExp]);
    setEditingExperience(true);
  };

  const aiImprove = async (id: string) => {
    const exp = tempExperience.find(e => e.id === id);
    if (!exp || !exp.description || !exp.role || !exp.company) {
      addNotification("Bullet points required for AI optimization.", "warning");
      return;
    }
    setImprovingId(id);
    try {
      const improved = await improveExperienceText(exp.role, exp.company, exp.description);
      setTempExperience(prev => prev.map(e => e.id === id ? { ...e, description: improved } : e));
      addNotification("Experience optimized with institutional action verbs.", "success");
    } finally {
      setImprovingId(null);
    }
  };

  const handleSourceRedirect = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      addNotification("Redirecting to authorized source...", "info");
    }
  };

  const profileCompletion = Math.min(
    100,
    (user.name ? 20 : 0) +
    (user.bio ? 20 : 0) +
    (user.experience?.length ? 20 : 0) +
    (user.interests?.length ? 20 : 0) +
    (user.socialProfiles.filter(s => s.url).length ? 20 : 0)
  );

  const activeMentorCount = user.mentorshipRequests.filter(r => r.status === 'accepted').length;

  return (
    <Layout>
      <div className="space-y-12 animate-in fade-in duration-700 pb-16">
        
        <ProfileCard 
          name={user.name}
          role={user.interests[0] ? `${user.interests[0]} Professional` : 'Innovation Candidate'}
          tagline={user.bio || 'Architecting high-impact professional trajectories within the T-Hub ecosystem.'}
          avatarUrl={user.avatar}
          completionPercentage={profileCompletion}
          location={user.preferences.publicProfile ? "Hyderabad Knowledge City" : "Private Node"}
          connectionsCount={142 + activeMentorCount} 
          verifiedSkillsCount={user.badges.length || 3}
          registeredEventsCount={registeredEventIds.length}
          onEdit={() => navigate('/settings')}
          onShare={() => {
            navigator.clipboard.writeText(`${window.location.origin}/#/profile/${user.id || 'me'}`);
            addNotification("Professional Identity Hash copied.", "success");
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            
            {user.mentorshipRequests.length > 0 && (
              <section className="prof-card p-10 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-4 mb-8">
                   <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <i className="ph ph-handshake text-3xl"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight">Ecosystem Synergy</h3>
                      <p className="text-[11px] text-secondary-light/40 font-black uppercase tracking-[0.2em] mt-1">Institutional Mentorship Network</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {user.mentorshipRequests.map(req => (
                     <div key={req.id} className="p-8 bg-surface-light dark:bg-surface-dark rounded-3xl border border-subtle-light dark:border-subtle-dark flex flex-col gap-5 shadow-sm">
                        <div className="flex justify-between items-center">
                           <h4 className="font-black text-sm">{req.mentorName}</h4>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                              {req.status}
                           </span>
                        </div>
                        {req.mentorResponse && (
                          <p className="text-xs text-secondary-light/80 dark:text-secondary-dark/80 italic font-medium leading-relaxed bg-elevated-light dark:bg-elevated-dark p-4 rounded-2xl border border-subtle-light dark:border-subtle-dark">
                             "{req.mentorResponse}"
                          </p>
                        )}
                        {req.status === 'accepted' && (
                          <button 
                            onClick={() => {
                              setActiveDialogue(req.mentorName);
                              addNotification("Secure terminal initializing...", "info");
                            }}
                            className="btn-primary w-fit py-2.5 text-[9px] px-6 shadow-none"
                          >
                             Start Synergy Session
                          </button>
                        )}
                     </div>
                   ))}
                </div>
              </section>
            )}

            {/* Saved Institutional Events */}
            <section className="prof-card p-10 bg-elevated-light/30 dark:bg-elevated-dark/30">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-sm">
                    <i className="ph ph-bookmark-simple text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Saved Interests</h3>
                    <p className="text-[11px] text-secondary-light/40 font-black uppercase tracking-[0.2em] mt-1">Tracked Ecosystem Opportunities</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/events')}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Explore Catalog
                </button>
              </div>

              {savedEventsList.length === 0 ? (
                <div className="p-10 text-center opacity-30 border-2 border-dashed border-subtle-light dark:border-subtle-dark rounded-[2rem]">
                  <p className="text-xs font-bold uppercase tracking-widest">Zero saved nodes</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedEventsList.map(event => (
                    <div key={event.id} onClick={() => handleSourceRedirect(event.externalLink)} className="p-6 bg-surface-light dark:bg-surface-dark rounded-[2rem] border border-subtle-light dark:border-subtle-dark flex gap-4 group cursor-pointer hover:border-primary transition-all">
                      <div className="size-16 rounded-2xl overflow-hidden shrink-0">
                        <img src={event.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black truncate group-hover:text-primary transition-colors">{event.title}</h4>
                        <p className="text-[9px] font-bold text-secondary-light/40 uppercase tracking-widest mt-1">{event.date} • {event.type}</p>
                      </div>
                      <i className="ph ph-arrow-up-right text-secondary-light/20 group-hover:text-primary transition-all self-center text-xl"></i>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="prof-card p-10">
              <div className="flex justify-between items-center mb-10 border-b border-subtle-light dark:border-subtle-dark pb-8">
                <div className="flex items-center gap-4">
                   <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                      <i className="ph ph-briefcase text-3xl"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight">Professional Journey</h3>
                      <p className="text-[11px] text-secondary-light/40 font-black uppercase tracking-[0.2em] mt-1">Verified Career History</p>
                   </div>
                </div>
                <button 
                  onClick={editingExperience ? saveExperience : addExperience}
                  className="px-6 py-3 bg-elevated-light dark:bg-elevated-dark text-secondary-light dark:text-secondary-dark rounded-xl text-[10px] font-black uppercase tracking-widest border border-subtle-light dark:border-subtle-dark hover:brightness-105"
                >
                  {editingExperience ? 'Commit Changes' : '+ Log Growth'}
                </button>
              </div>

              <div className="space-y-8">
                {(editingExperience ? tempExperience : user.experience || []).map((exp) => (
                    <div key={exp.id} className="p-8 bg-elevated-light/50 dark:bg-elevated-dark/50 rounded-3xl border border-subtle-light dark:border-subtle-dark group">
                      {editingExperience ? (
                        <div className="space-y-6">
                           <input placeholder="Entity Domain (e.g. t-hub.co)" value={exp.domain} onChange={e => setTempExperience(prev => prev.map(item => item.id === exp.id ? {...item, domain: e.target.value} : item))} className="w-full" />
                           <input placeholder="Official Designation" value={exp.role} onChange={e => setTempExperience(prev => prev.map(item => item.id === exp.id ? {...item, role: e.target.value} : item))} className="w-full" />
                           <textarea placeholder="Bullet points of breakthroughs..." value={exp.description} onChange={e => setTempExperience(prev => prev.map(item => item.id === exp.id ? {...item, description: e.target.value} : item))} className="w-full min-h-[120px]" />
                           <button onClick={() => aiImprove(exp.id)} disabled={improvingId === exp.id} className="text-primary text-[10px] font-black uppercase flex items-center gap-2">
                             <i className={`ph ph-sparkle ${improvingId === exp.id ? 'animate-spin' : ''}`}></i> AI Impact Optimization
                           </button>
                        </div>
                      ) : (
                        <div className="flex gap-8">
                           <div className="size-16 bg-surface-light dark:bg-surface-dark rounded-2xl border border-subtle-light dark:border-subtle-dark flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                              <InstitutionalLogo domain={exp.domain} name={exp.company} className="text-4xl" />
                           </div>
                           <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="text-xl font-black">{exp.role}</h4>
                                    <p className="text-sm font-bold text-primary">{exp.company || 'Innovation Partner'}</p>
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-secondary-light/40">{exp.duration || '2024 ACTIVE'}</span>
                              </div>
                              <p className="text-sm text-secondary-light/80 dark:text-secondary-dark/80 leading-relaxed font-medium">{exp.description}</p>
                           </div>
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <section className="prof-card p-10">
              <h3 className="text-xl font-black mb-10">Verified Nodes</h3>
              <div className="space-y-4">
                {user.socialProfiles.map((social) => (
                  <a 
                    key={social.platform} 
                    href={social.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-4 bg-elevated-light dark:bg-elevated-dark rounded-2xl border border-subtle-light dark:border-subtle-dark flex items-center gap-4 group transition-all hover:bg-surface-light dark:hover:bg-surface-dark shadow-sm ${!social.url && 'opacity-50 cursor-default'}`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center text-xl transition-all shadow-inner ${social.url ? 'text-primary bg-primary/10' : 'text-secondary-light/20 bg-main-light dark:bg-main-dark'}`}>
                       <i className={social.platform === 'LinkedIn' ? 'ph ph-linkedin-logo' : social.platform === 'GitHub' ? 'ph ph-github-logo' : 'ph ph-globe'}></i>
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-[9px] font-black uppercase text-secondary-light/40 tracking-widest">{social.platform}</p>
                       <p className="text-xs font-black truncate">{social.url ? new URL(social.url).hostname.replace('www.', '') : 'Node Offline'}</p>
                    </div>
                    {social.url && <i className="ph ph-arrow-up-right text-secondary-light/20 group-hover:text-primary transition-colors"></i>}
                  </a>
                ))}
              </div>
            </section>

            <div className="p-10 bg-primary text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <h3 className="text-xl font-black mb-4">Ecosystem Hub</h3>
               <p className="text-sm opacity-80 mb-8 font-bold leading-relaxed">Commit to new challenges in the ecosystem discover hub.</p>
               <button onClick={() => navigate('/events')} className="w-full py-4 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Explore Discovery Hub</button>
            </div>
          </aside>
        </div>
      </div>

      {activeDialogue && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-main-dark/95 backdrop-blur-xl" onClick={() => setActiveDialogue(null)} />
           <div className="relative w-full max-w-2xl bg-surface-dark border border-white/5 rounded-[3rem] overflow-hidden animate-in zoom-in-95 shadow-2xl flex flex-col h-[80vh]">
              <div className="p-8 border-b border-white/5 bg-elevated-dark/50 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                       <i className="ph ph-shield-check text-2xl"></i>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white">{activeDialogue}</h3>
                       <p className="text-[10px] text-primary font-black uppercase tracking-widest">Encrypted Ecosystem Dialogue</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveDialogue(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <i className="ph ph-x text-2xl"></i>
                 </button>
              </div>
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                 <div className="p-8 bg-white/5 rounded-3xl border border-white/5 italic text-slate-300 font-medium leading-relaxed">
                    "Welcome to the verified synergy channel. Your institutional record is synced. How can I assist in your strategic development today?"
                 </div>
                 <div className="mt-auto">
                    <div className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                       <input className="flex-1 bg-transparent border-none text-white outline-none focus:ring-0 placeholder:text-white/20" placeholder="Type response..." />
                       <button className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
                          <i className="ph ph-paper-plane-tilt text-xl"></i>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentDashboard;
