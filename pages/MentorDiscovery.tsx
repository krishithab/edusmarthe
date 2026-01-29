
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { getMentorMatch } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { ProfessionalAvatar } from '../constants/Logos';

type SortOption = 'ALPHABETICAL' | 'LEVEL' | 'EXPERTISE';

const MentorDiscovery: React.FC = () => {
  const { user, addNotification, addXP } = useUser();
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('ALPHABETICAL');

  const mentors = useMemo(() => [
    { 
      id: 'm1', 
      name: 'Deepak Pitambar Mahajan', 
      role: 'Senior Manager, Vehicle Propulsion', 
      company: 'Jaguar Land Rover (JLR TBSI)',
      tags: ['Engineering', 'Automotive', 'Leadership'], 
      level: 'Executive', 
      inst: 'JLR',
      linkedin: 'https://in.linkedin.com/in/deepak-pitambar-mahajan'
    },
    { 
      id: 'm2', 
      name: 'Kishore Karanala', 
      role: 'Senior Technical Specialist, SDV', 
      company: 'Jaguar Land Rover (JLR TBSI)',
      tags: ['Software', 'Research', 'Tech'], 
      level: 'Executive', 
      inst: 'JLR',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Kishore%20Karanala%20JLR'
    },
    { 
      id: 'm3', 
      name: 'Rama Iyer', 
      role: 'Head - Innovation', 
      company: 'GMR Group',
      tags: ['Innovation', 'Infrastructure', 'Aviation'], 
      level: 'Executive', 
      inst: 'GMR',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Rama%20Iyer%20GMR%20Group'
    },
    { 
      id: 'm4', 
      name: 'Raj Thota', 
      role: 'Advisor', 
      company: 'Stanford SEED',
      tags: ['Scaling', 'Global Business', 'Advisory'], 
      level: 'Executive', 
      inst: 'Stanford',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Raj%20Thota%20Stanford%20SEED'
    },
    { 
      id: 'm5', 
      name: 'Jayanthi Subramanian', 
      role: 'CEO/Co Founder', 
      company: 'Doctorite Inc',
      tags: ['HealthTech', 'Startup Strategy', 'Founder'], 
      level: 'Expert', 
      inst: 'Doctorite',
      linkedin: 'https://www.linkedin.com/in/jaysub'
    },
    { 
      id: 'm6', 
      name: 'Viiveck Verma', 
      role: 'Founder & CEO', 
      company: 'Upsurge Global',
      tags: ['Leadership', 'Impact', 'Coaching'], 
      level: 'Expert', 
      inst: 'Upsurge',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Viiveck%20Verma%20Upsurge%20Global'
    },
    { 
      id: 'm7', 
      name: 'Rajani Kasu', 
      role: 'CEO', 
      company: 'Zyppys',
      tags: ['Mobility', 'E-commerce', 'Operations'], 
      level: 'Expert', 
      inst: 'Zyppys',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Rajani%20Kasu%20Zyppys'
    },
    { 
      id: 'm8', 
      name: 'Patrick Widmann', 
      role: 'Head of Startup Programs', 
      company: 'KIT Innovation',
      tags: ['Incubation', 'International', 'KIT'], 
      level: 'Senior', 
      inst: 'KIT',
      linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Patrick%20Widmann%20KIT%20Innovation'
    },
  ], []);

  const sortedMentors = useMemo(() => {
    const list = [...mentors];
    const levelMap: Record<string, number> = { 'Executive': 3, 'Expert': 2, 'Senior': 1 };
    
    switch (sortBy) {
      case 'ALPHABETICAL':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'LEVEL':
        return list.sort((a, b) => levelMap[b.level] - levelMap[a.level]);
      case 'EXPERTISE':
        return list.sort((a, b) => a.tags[0].localeCompare(b.tags[0]));
      default:
        return list;
    }
  }, [sortBy, mentors]);

  const handleAIMatch = async () => {
    if (user.interests.length === 0) {
      addNotification("Please update your interests in profile settings first.", "warning");
      return;
    }
    setMatching(true);
    addNotification("Analyzing institutional network for synergy...", "info");
    try {
      const result = await getMentorMatch(user.interests, mentors);
      setMatchResult(result);
      addXP(50);
    } catch (e) {
      addNotification("AI analysis temporarily offline. Showing manual catalog.", "warning");
    } finally {
      setMatching(false);
    }
  };

  const handleLinkedInConnect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification("Opening verified LinkedIn pathway...", "info");
  };

  return (
    <Layout>
      <div className="space-y-12 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary-light dark:text-primary-dark">Be a T-Hub Protégé</h1>
            <p className="text-secondary-light dark:text-secondary-dark text-lg leading-relaxed font-medium">
              Engage with former entrepreneurs, founders, and business coaches setting aside time to give back. Enlighten and empower your trajectory.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {user.interests.map(interest => (
                <span key={interest} className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">{interest}</span>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-80 space-y-4">
            <div className="p-8 prof-card border-primary/20 bg-primary/5">
               <div className="flex items-center gap-4 mb-8">
                  <ProfessionalAvatar src={user.avatar} name={user.name} className="size-16" />
                  <div>
                     <h3 className="font-black text-sm">{user.name}</h3>
                     <p className="text-[10px] font-bold text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-widest leading-tight">Identity strength: {user.level * 8}%</p>
                  </div>
               </div>
               <button 
                 onClick={handleAIMatch}
                 disabled={matching}
                 className="btn-primary w-full py-4 text-[10px] uppercase tracking-widest shadow-primary/20"
               >
                 {matching ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-sparkle"></i>}
                 AI Synergy Match
               </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-elevated-light dark:bg-elevated-dark rounded-2xl w-fit border border-subtle-light dark:border-subtle-dark">
           {(['ALPHABETICAL', 'LEVEL', 'EXPERTISE'] as SortOption[]).map(tab => (
             <button 
              key={tab}
              onClick={() => setSortBy(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === tab ? 'bg-primary text-white shadow-lg' : 'text-secondary-light/40 hover:text-primary-light'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        {matchResult && (
           <div className="p-10 rounded-[2.5rem] bg-primary text-white border border-white/10 animate-in fade-in zoom-in-95 relative overflow-hidden shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <i className="ph ph-sparkle text-9xl"></i>
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-black text-xl flex items-center gap-2">
                   <i className="ph ph-certificate"></i> T-Hub Synergy Recommendation
                </h3>
                <p className="leading-relaxed text-lg font-medium">"{matchResult}"</p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setMatchResult(null)} className="px-8 py-3 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Acknowledge</button>
                </div>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedMentors.map((m) => {
            return (
              <div key={m.id} className="prof-card group overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 p-6 space-y-6">
                <div className="flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-black group-hover:text-primary transition-colors">{m.name}</h4>
                        <p className="text-[10px] text-primary font-black mt-1 uppercase tracking-widest">{m.role}</p>
                        <p className="text-[10px] text-secondary-light/60 dark:text-secondary-dark/60 font-bold uppercase tracking-widest mt-0.5">{m.company}</p>
                      </div>
                      <div className="px-3 py-1 bg-elevated-light dark:bg-elevated-dark rounded-lg text-[9px] font-black uppercase text-primary border border-primary/20 shadow-sm">{m.inst}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-2.5 py-1 bg-elevated-light dark:bg-elevated-dark border border-subtle-light dark:border-subtle-dark text-secondary-light dark:text-secondary-dark text-[8px] font-black uppercase tracking-widest rounded-lg">#{t}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => handleLinkedInConnect(m.linkedin)}
                      className="w-full py-4 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                    >
                      <i className="ph ph-linkedin-logo text-xl"></i>
                      Connect via LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default MentorDiscovery;
