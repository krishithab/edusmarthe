
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import EduBotFloating from './EduBotFloating';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, loading, theme, toggleTheme, notifications, signOut } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Progress', path: '/learning', icon: 'ph ph-graduation-cap' },
    { name: 'Network', path: '/network', icon: 'ph ph-users' },
    { name: 'Mentors', path: '/mentors', icon: 'ph ph-handshake' },
    { name: 'Venture', path: '/startups', icon: 'ph ph-rocket-launch' },
    { name: 'Events', path: '/events', icon: 'ph ph-calendar-blank' },
  ];

  const profileCompletion = Math.min(
    100,
    (user.name ? 20 : 0) +
    (user.bio ? 20 : 0) +
    (user.experience?.length ? 20 : 0) +
    (user.interests?.length ? 20 : 0) +
    (user.socialProfiles.filter(s => s.url).length ? 20 : 0)
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-main-light dark:bg-main-dark">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-main-light dark:bg-main-dark transition-colors duration-300 font-sans text-primary-light dark:text-primary-dark">
      <EduBotFloating />

      <div className="fixed top-20 right-6 z-[110] flex flex-col gap-3 pointer-events-none w-full max-w-xs">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-8 flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-2xl border border-subtle-light dark:border-subtle-dark">
            <div className={`size-6 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
              <i className={n.type === 'success' ? 'ph ph-check-circle' : 'ph ph-info'}></i>
            </div>
            <p className="text-[11px] font-bold leading-tight flex-1 text-primary-light dark:text-primary-dark">{n.message}</p>
          </div>
        ))}
      </div>

      <header className="sticky top-0 w-full z-[60] bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-subtle-light dark:border-subtle-dark h-16 px-8 shrink-0">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-8 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <i className="ph ph-briefcase font-bold text-xl"></i>
            </div>
            <h2 className="text-lg font-black tracking-tight text-primary-light dark:text-primary-dark">SmartEdu</h2>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 rounded-xl transition-all font-bold text-[11px] uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/10' 
                    : 'text-secondary-light/60 dark:text-secondary-dark/60 hover:text-primary hover:bg-elevated-light dark:hover:bg-elevated-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="hidden sm:flex size-9 bg-elevated-light dark:bg-elevated-dark rounded-xl items-center justify-center text-secondary-light dark:text-secondary-dark hover:text-primary transition-colors border border-subtle-light dark:border-subtle-dark">
              <i className={theme === 'light' ? 'ph ph-moon' : 'ph ph-sun'}></i>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pl-3 bg-elevated-light dark:bg-elevated-dark border border-subtle-light dark:border-subtle-dark rounded-2xl hover:border-primary transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-none text-secondary-light dark:text-secondary-dark">{profileCompletion}% Strength</p>
                </div>
                <div className="size-7 rounded-xl bg-cover bg-center border border-white/10" style={{backgroundImage: `url(${user.avatar})`}} />
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-56 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-subtle-light dark:border-subtle-dark p-2 animate-in fade-in zoom-in-95 origin-top-right">
                   <div className="p-4 border-b border-subtle-light dark:border-subtle-dark mb-2">
                        <p className="text-xs font-black truncate text-primary-light dark:text-primary-dark">{user.name}</p>
                        <p className="text-[9px] text-secondary-light dark:text-secondary-dark truncate uppercase tracking-widest font-bold mt-1">{user.tagline || 'Ecosystem Candidate'}</p>
                   </div>
                   <div className="space-y-1">
                     <Link to="/dashboard" className="flex items-center gap-3 w-full p-3 hover:bg-elevated-light dark:hover:bg-elevated-dark rounded-2xl text-secondary-light dark:text-secondary-dark transition-colors">
                        <i className="ph ph-user-circle text-xl"></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile Identity</span>
                     </Link>
                     <Link to="/settings" className="flex items-center gap-3 w-full p-3 hover:bg-elevated-light dark:hover:bg-elevated-dark rounded-2xl text-secondary-light dark:text-secondary-dark transition-colors">
                        <i className="ph ph-gear text-xl"></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">Ecosystem Prefs</span>
                     </Link>
                     <button onClick={handleSignOut} className="flex items-center gap-3 w-full p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-colors">
                        <i className="ph ph-sign-out text-xl"></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">De-authorize</span>
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-12 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto px-8 pt-8">
          {children}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-18 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-subtle-light dark:border-subtle-dark px-8 flex items-center justify-between z-[100] pb-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              location.pathname === link.path ? 'text-primary' : 'text-secondary-light dark:text-secondary-dark opacity-50'
            }`}
          >
            <i className={`${link.icon} text-xl`}></i>
            <span className="text-[8px] font-black uppercase tracking-tight">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
