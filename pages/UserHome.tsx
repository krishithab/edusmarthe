
import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const UserHome: React.FC = () => {
  const { user } = useUser();

  const profileCompletion = Math.min(
    100,
    (user.name ? 20 : 0) +
    (user.bio ? 20 : 0) +
    (user.experience?.length ? 20 : 0) +
    (user.interests?.length ? 20 : 0) +
    (user.socialProfiles.filter(s => s.url).length ? 20 : 0)
  );

  const toolkitItems = [
    { title: 'Identity Hub', icon: 'ph ph-user-circle', desc: 'Manage your verifiable resume and professional history dashboard.', path: '/dashboard' },
    { title: 'Growth Progress', icon: 'ph ph-graduation-cap', desc: 'Track certifications, academic paths, and institutional growth.', path: '/learning' },
    { title: 'Network Feed', icon: 'ph ph-users', desc: 'Engage with a verified community of creators and researchers.', path: '/network' },
    { title: 'Venture Lab', icon: 'ph ph-rocket-launch', desc: 'Prototype and validate startup concepts with strategic risk analysis.', path: '/startups' },
    { title: 'Industry Mentors', icon: 'ph ph-handshake', desc: 'Connect with experts matched to your professional trajectory.', path: '/mentors' },
    { title: 'Global Events', icon: 'ph ph-calendar-blank', desc: 'Find institutional hackathons, career workshops, and summits.', path: '/events' },
    { title: 'Institute Access', icon: 'ph ph-shield-check', desc: 'Authorized terminal for institutional health and student registry monitoring.', path: '/admin', highlight: true }
  ];

  return (
    <Layout>
      <div className="space-y-12 pb-16 animate-in fade-in duration-500">
        
        {/* Welcome Block */}
        <section className="relative overflow-hidden py-12 px-8 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Welcome, {user.name.split(' ')[0]}
              </h1>
              <i className="ph-fill ph-seal-check text-emerald-500 text-2xl" title="Verified Institutional Partner"></i>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium max-w-xl">
              Manage your verified career history, refine professional trajectories, and explore mentorship within our institutional network.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/dashboard" className="btn-primary">
                Explore Profile Hub
              </Link>
              <div className="flex flex-col gap-1 px-5 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Career Identity Strength</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${profileCompletion}%` }} />
                  </div>
                  <span className="text-[11px] font-black text-primary">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolkit Section */}
        <section className="space-y-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Institutional Toolkit</h2>
            <p className="text-slate-500 text-base font-medium">Standardized tools for high-impact professional advancement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolkitItems.map((f) => (
              <Link 
                key={f.title} 
                to={f.path} 
                className={`prof-card group p-8 flex flex-col items-start text-left relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 ${f.highlight ? 'border-primary/40 bg-primary/5' : ''}`}
              >
                {f.highlight && <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Elevated Access</div>}
                
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-8 transition-all shadow-inner ${f.highlight ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-primary'}`}>
                  <i className={`${f.icon} text-2xl`}></i>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-black group-hover:text-primary transition-colors">{f.title}</h3>
                  <i className="ph ph-shield-check text-slate-300 dark:text-slate-700 text-sm"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UserHome;
