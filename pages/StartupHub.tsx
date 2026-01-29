
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { getStartupRiskAnalysis, generateStartupVisual } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { VentureAnalysis } from '../types';
import { InstitutionalLogo } from '../constants/Logos';

const GLOBAL_NODES = [
  // Institutional Hubs
  { name: 'T-Hub Hyderabad', domain: 't-hub.co', category: 'Innovation Hub' },
  { name: 'WE Hub', domain: 'wehub.telangana.gov.in', category: 'Women Entrepreneurship' },
  { name: 'Startup India', domain: 'startupindia.gov.in', category: 'National Node' },
  { name: 'NASSCOM', domain: 'nasscom.in', category: 'Industry Body' },
  
  // Intelligence & Growth
  { name: 'OpenAI', domain: 'openai.com', category: 'Intelligence Node' },
  { name: 'Google for Startups', domain: 'startups.google.com', category: 'Global Growth' },
  { name: 'AWS Activate', domain: 'aws.amazon.com', category: 'Cloud Partner' },
  { name: 'Microsoft Startups', domain: 'microsoft.com', category: 'Growth Node' },
  
  // Venture & Finance
  { name: 'Y Combinator', domain: 'ycombinator.com', category: 'Accelerator' },
  { name: 'Sequoia Capital', domain: 'sequoiacap.com', category: 'Venture Capital' },
  { name: 'Stripe', domain: 'stripe.com', category: 'Financial Infra' },
  { name: 'Accel Partners', domain: 'accel.com', category: 'Venture Capital' }
];

const StartupHub: React.FC = () => {
  const { user, addXP, addNotification, savePitch } = useUser();
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'BUILD' | 'HISTORY'>('BUILD');

  const runAnalysis = async () => {
    if (!analysisInput.trim()) {
      addNotification("Please provide a concept narrative first.", "warning");
      return;
    }
    setIsAnalyzing(true);
    try {
      const [risk, visual] = await Promise.all([
        getStartupRiskAnalysis(analysisInput),
        generateStartupVisual(analysisInput)
      ]);
      
      setAnalysisResult(risk);
      setVisualUrl(visual);
      
      const newPitch: VentureAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        concept: analysisInput,
        analysis: risk,
        visualUrl: visual,
        date: new Date().toLocaleDateString()
      };
      savePitch(newPitch);
      addXP(200);
      addNotification("Institutional analysis complete. +200 XP", "success");
    } catch (e) {
      addNotification("Venture Lab systems are overloaded.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12 pb-24">
        {/* Header Hero */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest">
              <i className="ph ph-shield-check"></i>
              Institutional Venture Node
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none text-primary-light dark:text-primary-dark">Venture Architect</h1>
            <p className="text-secondary-light dark:text-secondary-dark text-base md:text-xl font-medium opacity-80 max-w-2xl">
              De-risk your startup with the <span className="text-primary underline underline-offset-4">6M2P Framework</span>. Connect with verified growth nodes.
            </p>
            <div className="flex gap-2 p-1 bg-elevated-light dark:bg-elevated-dark rounded-xl w-fit border border-subtle-light dark:border-subtle-dark">
              <button onClick={() => setActiveTab('BUILD')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BUILD' ? 'bg-primary text-white shadow-lg' : 'text-secondary-light/40 hover:text-primary-light'}`}>Venture Lab</button>
              <button onClick={() => setActiveTab('HISTORY')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'HISTORY' ? 'bg-primary text-white shadow-lg' : 'text-secondary-light/40 hover:text-primary-light'}`}>Registry</button>
            </div>
          </div>
        </div>

        {activeTab === 'BUILD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="p-6 md:p-10 prof-card border-primary/10 bg-surface-light dark:bg-surface-dark shadow-sm">
                <div className="space-y-8">
                  <textarea 
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    placeholder="Describe your innovation... Focus on Product, Manpower, and Market."
                    className="w-full bg-elevated-light dark:bg-slate-900 border border-subtle-light dark:border-subtle-dark rounded-3xl p-8 min-h-[240px] text-lg font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="btn-primary w-full py-5 text-[10px] uppercase tracking-[0.3em]"
                  >
                    {isAnalyzing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-sparkle"></i>}
                    {isAnalyzing ? 'Processing 6M2P Framework...' : 'Initiate Risk Scan'}
                  </button>
                </div>

                {(analysisResult || visualUrl) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 mt-10 border-t border-subtle-light dark:border-subtle-dark">
                    <div className="space-y-6">
                      <h4 className="font-black text-lg tracking-tight flex items-center gap-2">
                        <i className="ph ph-chart-pie text-primary"></i> 6M2P Analysis
                      </h4>
                      <div className="p-6 bg-elevated-light dark:bg-slate-900 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap text-secondary-light dark:text-secondary-dark font-medium border border-subtle-light dark:border-subtle-dark overflow-y-auto max-h-[400px]">
                        {analysisResult}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h4 className="font-black text-lg tracking-tight flex items-center gap-2">
                        <i className="ph ph-palette text-primary"></i> Visual Identity
                      </h4>
                      {visualUrl ? (
                        <div className="rounded-3xl overflow-hidden border-4 border-elevated-light dark:border-elevated-dark shadow-xl">
                          <img src={visualUrl} className="w-full aspect-square object-cover" alt="Venture Visual" />
                        </div>
                      ) : (
                        <div className="aspect-square bg-elevated-light dark:bg-slate-900 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-primary/20 opacity-40">
                          <i className="ph ph-image text-5xl mb-4"></i>
                          <p className="text-[10px] font-black uppercase tracking-widest">Generating Identity...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Partners Grid */}
              <section className="space-y-8">
                <h2 className="text-2xl font-black tracking-tight">Institutional Network</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {GLOBAL_NODES.map((node) => (
                      <div 
                        key={node.domain}
                        onClick={() => window.open(`https://${node.domain}`, '_blank')}
                        className="p-6 prof-card bg-surface-light dark:bg-surface-dark border border-subtle-light dark:border-subtle-dark hover:border-primary transition-all group flex flex-col items-center text-center gap-4 cursor-pointer shadow-sm"
                      >
                         <div className="size-16 rounded-2xl bg-elevated-light dark:bg-elevated-dark flex items-center justify-center p-3">
                            <InstitutionalLogo domain={node.domain} name={node.name} className="size-full" />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">{node.name}</h4>
                            <p className="text-[8px] opacity-40 uppercase font-bold">{node.category}</p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-6">
               <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden shadow-xl border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                  <h3 className="text-xl font-black mb-4">T-Fund Access</h3>
                  <p className="opacity-60 text-sm leading-relaxed mb-8">Direct authorized access to WE Hub grants and T-Fund angel syndicates.</p>
                  <button className="w-full py-4 bg-primary text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Initiate Review</button>
               </div>
            </aside>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.pitches?.map(pitch => (
              <div key={pitch.id} className="prof-card p-8 bg-surface-light dark:bg-surface-dark border border-subtle-light dark:border-subtle-dark flex flex-col gap-6 shadow-sm hover:border-primary transition-all">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                   {pitch.visualUrl ? <img src={pitch.visualUrl} className="w-full h-full object-cover" /> : <i className="ph ph-rocket-launch text-5xl opacity-20"></i>}
                </div>
                <div>
                  <h4 className="font-black text-lg">Venture Record</h4>
                  <p className="text-xs text-secondary-light/60 dark:text-secondary-dark/60 line-clamp-2 mt-2 font-medium italic">"{pitch.concept}"</p>
                </div>
                <button 
                  onClick={() => {
                    setAnalysisResult(pitch.analysis);
                    setVisualUrl(pitch.visualUrl || null);
                    setAnalysisInput(pitch.concept);
                    setActiveTab('BUILD');
                  }}
                  className="w-full py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                >
                   Restore Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StartupHub;
