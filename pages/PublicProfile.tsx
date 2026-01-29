
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PublicProfile: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();

  const profile = (id === user.id || id === 'me') ? user : {
    ...user,
    name: "Alex Rivera",
    bio: "Passionate about building the future of AI-driven education systems. Aspiring System Architect and UI Specialist focused on hyper-personalized student trajectories.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
    level: 12,
    interests: ['AI Architecture', 'Fintech', 'UX Engineering'],
    experience: [
      { id: '1', company: 'Neural Systems', role: 'AI Engineering Intern', duration: 'Jun 2023 - Present', description: 'Collaborating on deep learning model architecture and real-time inference optimization for educational platforms.', domain: 'nvidia.com' }
    ],
    badges: [
      { id: 'b1', name: 'AI Architect', icon: 'ph ph-brain', color: 'bg-indigo-500', description: 'Institutional AI Proficiency' },
      { id: 'b2', name: 'Beta Founder', icon: 'ph ph-rocket-launch', color: 'bg-emerald-500', description: 'Venture Lab Graduate' }
    ]
  };

  return (
    <div className="min-h-screen bg-main-light dark:bg-main-dark text-primary-light dark:text-primary-dark font-sans theme-transition">
      <nav className="fixed top-0 w-full z-50 glass border-b border-subtle-light dark:border-subtle-dark h-20 px-8">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
           <Link to="/" className="flex items-center gap-3 group">
              <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <i className="ph ph-briefcase font-bold text-2xl"></i>
              </div>
              <h2 className="text-xl font-black tracking-tighter">SmartEdu</h2>
           </Link>
           <Link to="/onboarding" className="btn-primary py-3 px-8 text-[10px]">Create Identity</Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto">
        <div className="prof-card bg-surface-light dark:bg-surface-dark border-subtle-light dark:border-subtle-dark shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
           {/* Cover Banner */}
           <div className="h-48 md:h-80 bg-gradient-to-r from-primary via-indigo-600 to-blue-500 relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute bottom-8 right-12 flex gap-3">
                 <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase text-white tracking-widest border border-white/10">Active Evolution</div>
              </div>
           </div>

           {/* Profile Header */}
           <div className="px-10 md:px-20 pb-20 -mt-24 md:-mt-32 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
                 <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                    <div className="size-48 md:size-64 rounded-[3rem] bg-white dark:bg-slate-900 p-3 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                       <img src={profile.avatar} className="w-full h-full object-contain" alt="Identity Avatar" />
                    </div>
                    <div className="space-y-4 pb-4">
                       <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{profile.name}</h1>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          <span className="px-5 py-2 bg-primary/10 text-primary text-[11px] font-black uppercase rounded-xl border border-primary/20">Level {profile.level} Scholar</span>
                          <span className="px-5 py-2 bg-elevated-light dark:bg-elevated-dark text-secondary-light/60 dark:text-secondary-dark/60 text-[11px] font-black uppercase rounded-xl border border-subtle-light dark:border-subtle-dark">Institutional Partner</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    {profile.socialProfiles?.filter(s => s.url).map(s => (
                       <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="size-14 rounded-2xl bg-elevated-light dark:bg-elevated-dark flex items-center justify-center text-secondary-light dark:text-secondary-dark hover:text-primary transition-all border border-subtle-light dark:border-subtle-dark shadow-sm">
                          <i className={`ph ph-${s.platform.toLowerCase()}-logo text-2xl`}></i>
                       </a>
                    ))}
                 </div>
              </div>

              {/* Grid Content */}
              <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
                 
                 {/* Left Column */}
                 <div className="lg:col-span-8 space-y-20">
                    <div className="space-y-8">
                       <h3 className="text-xs font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-[0.5em] flex items-center gap-4">
                         <span className="size-2 bg-primary rounded-full animate-pulse" /> Identity Narratives
                       </h3>
                       <p className="text-2xl md:text-4xl text-primary-light dark:text-primary-dark leading-[1.3] font-medium tracking-tight">
                          {profile.bio || "Candidate has not finalized their public narrative. This node is focused on institutional growth pathways within the SmartEdu network."}
                       </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-12">
                       <div className="flex items-center gap-6">
                          <div className="size-14 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                             <i className="ph ph-briefcase-metal text-3xl"></i>
                          </div>
                          <h3 className="text-[11px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-[0.5em]">Trajectory Records</h3>
                       </div>
                       
                       <div className="space-y-16 pl-6 border-l-4 border-subtle-light dark:border-subtle-dark ml-8">
                          {profile.experience && profile.experience.length > 0 ? (
                            profile.experience.map((exp) => (
                              <div key={exp.id} className="relative group pl-12">
                                 <div className="absolute -left-[1.85rem] top-2 size-6 rounded-full bg-primary border-4 border-surface-light dark:border-surface-dark group-hover:scale-150 transition-all shadow-xl shadow-primary/40" />
                                 <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                       <div className="flex items-center gap-6">
                                          <div className="size-16 rounded-2xl bg-elevated-light dark:bg-elevated-dark p-3 border border-subtle-light dark:border-subtle-dark shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                             <img 
                                                src={exp.domain ? `https://logo.clearbit.com/${exp.domain}` : `https://api.dicebear.com/7.x/initials/svg?seed=${exp.company}`} 
                                                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" 
                                                onError={(e) => e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=CO"}
                                             />
                                          </div>
                                          <div>
                                             <h4 className="text-3xl font-black leading-none mb-1 group-hover:text-primary transition-colors">{exp.role}</h4>
                                             <p className="text-base font-bold text-primary">{exp.company}</p>
                                          </div>
                                       </div>
                                       <span className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest px-4 py-2 bg-elevated-light dark:bg-elevated-dark rounded-xl border border-subtle-light dark:border-subtle-dark">{exp.duration}</span>
                                    </div>
                                    <p className="text-lg md:text-xl text-secondary-light/80 dark:text-secondary-dark/80 leading-relaxed font-medium">
                                       {exp.description}
                                    </p>
                                 </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 opacity-30 italic font-black text-xl uppercase tracking-widest">Growth in progress...</div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="flex items-center gap-6">
                          <div className="size-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary border border-primary/20">
                             <i className="ph ph-brain text-3xl"></i>
                          </div>
                          <h3 className="text-[11px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-[0.5em]">Neural Network Focus</h3>
                       </div>
                       <div className="flex flex-wrap gap-4">
                          {profile.interests.map(node => (
                             <span key={node} className="px-8 py-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-default shadow-sm">{node}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Sidebar */}
                 <div className="lg:col-span-4 space-y-12">
                    <div className="p-12 rounded-[3.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10 border border-white/5">
                       <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                          <i className="ph ph-medal text-9xl"></i>
                       </div>
                       <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12 relative z-10">Credentials</h3>
                       <div className="grid grid-cols-2 gap-10 relative z-10">
                          {profile.badges.length > 0 ? profile.badges.map(badge => (
                             <div key={badge.id} className="flex flex-col items-center text-center gap-6 group">
                                <div className={`size-20 md:size-24 rounded-[2rem] ${badge.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700 border-4 border-slate-900 ring-2 ring-white/10`}>
                                   <i className={`${badge.icon} text-4xl`}></i>
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight px-2">{badge.name}</p>
                             </div>
                          )) : (
                             <div className="col-span-2 py-16 text-center opacity-40 space-y-4">
                                <i className="ph ph-lock text-5xl"></i>
                                <p className="text-[10px] font-black uppercase tracking-widest">Pathways Initializing</p>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Pathways Widget */}
                    <div className="p-12 rounded-[3.5rem] bg-surface-light dark:bg-slate-900 border border-subtle-light dark:border-subtle-dark shadow-xl space-y-10">
                       <h3 className="text-[11px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-[0.5em]">Global Learning Nodes</h3>
                       <div className="space-y-6">
                          {profile.enrolledCourses.slice(0, 3).map(course => (
                             <div key={course.id} className="p-6 bg-elevated-light/50 dark:bg-elevated-dark/50 border border-subtle-light dark:border-subtle-dark rounded-[2rem] flex items-center gap-6 group hover:border-primary transition-all">
                                <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 border border-subtle-light dark:border-subtle-dark shrink-0 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                   <img src={`https://logo.clearbit.com/${course.domain || 'google.com'}`} className="size-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="min-w-0">
                                   <h4 className="font-black text-base truncate leading-tight group-hover:text-primary transition-colors">{course.title}</h4>
                                   <p className="text-[10px] text-secondary-light/40 dark:text-secondary-dark/40 font-bold uppercase truncate tracking-widest mt-1">{course.provider}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    {/* Final CTA */}
                    <div className="p-12 bg-primary rounded-[3.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group border border-white/10">
                       <div className="absolute top-0 right-0 size-40 bg-white/20 blur-[60px] -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                       <h3 className="text-3xl font-black leading-none mb-6 relative z-10">Evolve Your Career.</h3>
                       <p className="text-white/70 text-base font-medium mb-12 leading-relaxed relative z-10">Establish a verifiable trajectory like {profile.name.split(' ')[0]} and gain access to the global T-Hub network.</p>
                       <Link to="/onboarding" className="w-full py-6 bg-white text-primary rounded-2xl flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl relative z-10 hover:scale-[1.03] transition-transform active:scale-95 group">
                          Initiate Authorized Onboarding <i className="ph ph-arrow-right text-xl transition-transform group-hover:translate-x-2"></i>
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-24 text-center border-t border-subtle-light dark:border-subtle-dark bg-white/50 dark:bg-slate-900/50">
        <p className="text-secondary-light/30 dark:text-secondary-dark/30 text-[10px] font-black uppercase tracking-[0.5em]">© MMXXIV SmartEdu Institutional Career Infrastructure</p>
      </footer>
    </div>
  );
};

export default PublicProfile;
