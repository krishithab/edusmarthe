
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-main-light dark:bg-main-dark text-primary-light dark:text-primary-dark min-h-screen theme-transition font-sans">
      <header className="sticky top-0 w-full z-50 bg-surface-light/80 dark:bg-main-dark/80 backdrop-blur-md border-b border-subtle-light dark:border-subtle-dark h-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <i className="ph ph-briefcase font-bold text-2xl"></i>
            </div>
            <h2 className="text-xl font-black tracking-tighter">SmartEdu</h2>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" onClick={scrollToFeatures} className="text-[11px] font-black uppercase tracking-widest text-secondary-light/60 dark:text-secondary-dark/60 hover:text-primary transition-colors">Platform</a>
            <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-secondary-light/60 dark:text-secondary-dark/60 hover:text-primary transition-colors">Experience</Link>
            <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-secondary-light/60 dark:text-secondary-dark/60 hover:text-primary transition-colors">Growth</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-secondary-light/60 dark:text-secondary-dark/60 hover:text-primary-light dark:hover:text-primary-dark transition-colors">Log In</Link>
            <Link to="/onboarding" className="btn-primary py-3 px-8">Get Started</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-32 md:py-52 text-center px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 pointer-events-none">
             <div className="w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          </div>
          
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-primary-light dark:text-primary-dark">
              The Platform for <br/> <span className="text-primary italic">Career Identity.</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              A professional ecosystem for high-impact students. Build a verifiable career history, find mentors, and turn academic projects into market-ready ventures. 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding" className="btn-primary py-5 px-12 text-sm">
                Initiate Profile Identity
              </Link>
              <Link to="/login" className="px-12 py-5 bg-surface-light dark:bg-surface-dark border border-subtle-light dark:border-subtle-dark text-primary-light dark:text-primary-dark font-black rounded-2xl text-sm hover:brightness-105 transition-all uppercase tracking-widest">
                Institutional Access
              </Link>
            </div>
          </div>
        </section>

        {/* Value Grid */}
        <section id="features" className="py-32 px-6 border-t border-subtle-light dark:border-subtle-dark bg-elevated-light/50 dark:bg-main-dark/50">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">System Built for Growth ✨</h2>
              <p className="text-secondary-light dark:text-secondary-dark text-xl max-w-xl mx-auto font-medium">SmartEdu bridges the gap between academic theory and institutional professional practice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Growth Tracking', 
                  icon: 'ph ph-chart-line-up', 
                  desc: 'Dynamic career mapping with real-time industry certification validation.',
                  emoji: '📈'
                },
                { 
                  title: 'Venture Architect', 
                  icon: 'ph ph-rocket-launch', 
                  desc: 'AI-driven startup risk analysis and concept visualization for student projects.',
                  emoji: '🚀'
                },
                { 
                  title: 'Institutional Network', 
                  icon: 'ph ph-handshake', 
                  desc: 'Synergy-based matching with verified industry mentors and partners.',
                  emoji: '🤝'
                }
              ].map((f) => (
                <div key={f.title} className="prof-card p-12 flex flex-col items-center text-center group">
                  <div className="size-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-10 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <i className={`${f.icon} text-4xl`}></i>
                  </div>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-primary-light dark:text-primary-dark">
                    {f.title} {f.emoji}
                  </h3>
                  <p className="text-secondary-light dark:text-secondary-dark leading-relaxed text-base font-medium opacity-80">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-subtle-light dark:border-subtle-dark px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl text-white flex items-center justify-center shadow-lg">
              <i className="ph ph-briefcase font-bold text-2xl"></i>
            </div>
            <h2 className="text-xl font-black tracking-tighter">SmartEdu</h2>
          </div>
          <p className="text-secondary-light/40 dark:text-secondary-dark/40 text-[10px] font-black uppercase tracking-[0.5em]">© 2024 Institutional Career Infrastructure 🏛️</p>
          <div className="flex gap-10">
            <i className="ph ph-linkedin-logo text-secondary-light/40 dark:text-secondary-dark/40 hover:text-primary cursor-pointer text-2xl transition-all"></i>
            <i className="ph ph-twitter-logo text-secondary-light/40 dark:text-secondary-dark/40 hover:text-primary cursor-pointer text-2xl transition-all"></i>
            <i className="ph ph-github-logo text-secondary-light/40 dark:text-secondary-dark/40 hover:text-primary cursor-pointer text-2xl transition-all"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
