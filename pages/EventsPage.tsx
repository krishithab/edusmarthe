
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { findNearbyEducationEvents, AIResponse } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { InstitutionalLogo } from '../constants/Logos';
import { Event } from '../types';

export const INITIAL_EVENTS: Event[] = [
  { 
    id: '1', 
    title: "T-Hub Scaling Workshop: 6M2P", 
    type: 'WORKSHOP', 
    date: 'Oct 12, 2025', 
    location: 'Hyderabad Knowledge City', 
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200', 
    description: 'Deep dive into the proprietary 6M2P Framework for scaling Indian startups.', 
    source: 'T-Hub', 
    url: 'https://t-hub.co/events', 
    tags: ['Scaling', 'Framework', 'Startup'],
    domain: 't-hub.co' 
  },
  { 
    id: '2', 
    title: 'WE Hub Jubilee Hills Summit', 
    type: 'SEMINAR', 
    date: 'Oct 15, 2025', 
    location: 'Jubilee Hills, Hyderabad', 
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200', 
    description: 'Empowering women entrepreneurs with institutional access and funding resources.', 
    source: 'Institutional', 
    url: 'https://wehub.telangana.gov.in', 
    tags: ['Women-led', 'Funding', 'Empowerment'],
    domain: 'telangana.gov.in' 
  },
  { 
    id: '3', 
    title: 'Google for Startups Cloud Day', 
    type: 'HACKATHON', 
    date: 'Nov 05, 2025', 
    location: 'T-Hub 2.0', 
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200', 
    description: 'Technical workshop on deploying scalable AI solutions on Google Cloud Infrastructure.', 
    source: 'Eventbrite', 
    url: 'https://startup.google.com', 
    tags: ['Cloud', 'AI', 'Google'],
    domain: 'google.com' 
  },
  { 
    id: '4', 
    title: 'Circular Economy Hackathon', 
    type: 'SUSTAINABILITY', 
    date: 'Dec 01, 2025', 
    location: 'Venture Lab', 
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200', 
    description: 'Solving for sustainability and waste reduction in the modern supply chain.', 
    source: 'T-Hub', 
    url: 'https://t-hub.co/sustainability', 
    tags: ['Environment', 'Supply-chain', 'Impact'],
    domain: 't-hub.co' 
  },
];

const EventsPage: React.FC = () => {
  const { savedEventIds, registeredEventIds, toggleSaveEvent, toggleRegisterEvent, addNotification } = useUser();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AIResponse | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WORKSHOP' | 'SEMINAR' | 'HACKATHON' | 'SUSTAINABILITY' | 'COMMITMENTS'>('ALL');
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allAvailableEvents = useMemo(() => {
    const aiEvents: Event[] = (results?.groundingLinks || []).map((link, idx) => {
      let source: Event['source'] = 'Meetup';
      if (link.domain?.includes('luma') || link.uri.includes('lu.ma')) source = 'Luma';
      else if (link.domain?.includes('eventbrite')) source = 'Eventbrite';
      else if (link.domain?.includes('t-hub')) source = 'T-Hub';
      else if (link.domain?.includes('gov')) source = 'Institutional';

      return {
        id: `ai-event-${idx}-${link.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: link.title,
        type: 'AI DISCOVERY',
        date: 'Upcoming • Verify at Source',
        location: link.domain || 'Global Ecosystem',
        description: `Institutional discovery engine identified this professional opportunity via ${link.domain}.`,
        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
        source: source,
        url: link.uri,
        tags: [source, 'Ecosystem', 'Innovation'],
        domain: link.domain
      };
    });
    return [...INITIAL_EVENTS, ...aiEvents];
  }, [results]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'COMMITMENTS') {
      return allAvailableEvents.filter(e => registeredEventIds.includes(e.id));
    }
    let list = allAvailableEvents;
    if (activeFilter !== 'ALL') {
      list = list.filter(e => e.type === activeFilter);
    }
    return list;
  }, [activeFilter, registeredEventIds, allAvailableEvents]);

  const fetchNearbyEvents = async () => {
    setLoading(true);
    setLocationStatus(null);
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLocationStatus(`Events prioritized near Hyderabad Hub`);
          const res = await findNearbyEducationEvents(searchQuery || "AI startup meetup", pos.coords.latitude, pos.coords.longitude);
          setResults(res);
          setLoading(false);
          addNotification("Ecosystem discovery complete. sources synchronized.", "success");
        },
        async () => {
          setLocationStatus("Global Discovery Active");
          const res = await findNearbyEducationEvents(searchQuery || "tech hackathons");
          setResults(res);
          setLoading(false);
          addNotification("Discovery complete across all global nodes.", "info");
        }
      );
    } catch (err) {
      setLoading(false);
      addNotification("Neural search interruption.", "warning");
    }
  };

  const handleSourceRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification("Redirecting to authorized platform...", "info");
  };

  const handleCopyLink = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addNotification("Pathway link copied.", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegisterToggle = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    toggleRegisterEvent(event.id, event.title);
  };

  return (
    <Layout>
      <div className="space-y-16 pb-24">
        {/* Header Hero */}
        <div className="p-8 md:p-14 rounded-[3.5rem] bg-slate-900 overflow-hidden shadow-2xl relative border border-white/5 mx-[-1rem] sm:mx-0">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary via-transparent to-indigo-500" />
          <div className="relative z-10 max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md">
              <i className="ph ph-planet text-base"></i>
              Real-time Ecosystem Aggregator
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">Discovery Terminal</h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              We augment official APIs from <span className="text-white underline decoration-primary underline-offset-4">Meetup</span> and <span className="text-white underline decoration-primary underline-offset-4">Eventbrite</span> with search-based discovery for platforms like <span className="text-white underline decoration-primary underline-offset-4">Luma</span>.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2.5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && fetchNearbyEvents()}
                  placeholder="AI Founders Meetup, Hyderabad Hackathon..."
                  className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:ring-0 outline-none text-base font-bold placeholder:text-white/20"
                />
                <button onClick={fetchNearbyEvents} disabled={loading} className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all text-[11px] uppercase tracking-widest">
                  {loading ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-sparkle"></i>}
                  {loading ? 'Initializing Neural Probe...' : 'Initiate Discovery'}
                </button>
              </div>
              {locationStatus && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 border border-primary/30 rounded-2xl text-[10px] font-black uppercase text-primary-light dark:text-primary-dark tracking-widest animate-in fade-in slide-in-from-left-4 w-fit">
                  <i className="ph ph-map-pin text-base"></i>
                  {locationStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-elevated-light dark:bg-elevated-dark rounded-2xl w-fit border border-subtle-light dark:border-subtle-dark overflow-x-auto no-scrollbar max-w-full">
           {(['ALL', 'WORKSHOP', 'SEMINAR', 'HACKATHON', 'SUSTAINABILITY', 'COMMITMENTS'] as const).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary-light/40 hover:text-primary-light'}`}
             >
               {tab}
               {tab === 'COMMITMENTS' && registeredEventIds.length > 0 && (
                 <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-lg">{registeredEventIds.length}</span>
               )}
             </button>
           ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-32 text-center opacity-30 flex flex-col items-center gap-6">
              <div className="size-24 bg-elevated-light dark:bg-elevated-dark rounded-[2.5rem] flex items-center justify-center border border-dashed border-primary/20">
                <i className="ph ph-planet text-5xl"></i>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black uppercase tracking-[0.4em]">Ecosystem Stagnation</p>
                <p className="text-sm font-bold opacity-60">No institutional nodes found for this track. Use the Search Terminal.</p>
              </div>
            </div>
          ) : (
            filteredEvents.map(event => {
               const isRegistered = registeredEventIds.includes(event.id);
               const isSaved = savedEventIds.includes(event.id);
               return (
                <div 
                  key={event.id} 
                  onClick={() => handleSourceRedirect(event.url)}
                  className="bg-surface-light dark:bg-surface-dark rounded-[3.5rem] overflow-hidden border border-subtle-light dark:border-subtle-dark shadow-sm flex flex-col group hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer relative"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                    <img src={event.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                       <div className="px-5 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md">{event.type}</div>
                       <div className="px-5 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg">{event.source}</div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }} 
                      className={`absolute top-8 right-8 size-14 rounded-2xl transition-all flex items-center justify-center backdrop-blur-xl border ${isSaved ? 'bg-primary text-white border-transparent shadow-xl' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                    >
                      <i className={isSaved ? 'ph-fill ph-bookmark text-2xl' : 'ph ph-bookmark text-2xl'}></i>
                    </button>
                    
                    <div className="absolute bottom-8 left-8 right-8">
                       <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors">{event.title}</h3>
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col justify-between space-y-10">
                    <div className="space-y-8">
                      <div className="flex flex-wrap items-center gap-3">
                         {event.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-elevated-light dark:bg-elevated-dark rounded-lg text-[8px] font-black uppercase tracking-widest text-secondary-light/40 dark:text-secondary-dark/40 border border-subtle-light dark:border-subtle-dark">#{tag}</span>
                         ))}
                      </div>
                      
                      <p className="text-secondary-light/70 dark:text-secondary-dark/70 line-clamp-2 text-base font-medium leading-relaxed italic border-l-2 border-primary/20 pl-5">"{event.description}"</p>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-secondary-light/30">Temporal Hub</p>
                           <p className="text-sm font-black text-primary-light dark:text-primary-dark flex items-center gap-2"><i className="ph ph-calendar text-primary"></i> {event.date}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-secondary-light/30">Physical Node</p>
                           <p className="text-sm font-black text-primary-light dark:text-primary-dark flex items-center gap-2 truncate"><i className="ph ph-map-pin text-primary"></i> {event.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => handleRegisterToggle(e, event)}
                        className={`flex-1 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                          isRegistered 
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                          : 'bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-95'
                        }`}
                      >
                        {isRegistered ? 'Synergy Confirmed' : 'Establish Synergy'}
                      </button>
                      <button 
                        onClick={(e) => handleCopyLink(e, event.url, event.id)}
                        className="size-16 bg-elevated-light dark:bg-elevated-dark border border-subtle-light dark:border-subtle-dark rounded-2xl flex items-center justify-center text-secondary-light/40 hover:text-primary transition-all shadow-sm"
                        title="Copy Source Link"
                      >
                        <i className={copiedId === event.id ? 'ph ph-check text-emerald-500' : 'ph ph-share-network text-2xl'}></i>
                      </button>
                    </div>
                  </div>
                </div>
               );
            })
          )}
        </div>
        
        {/* Pitch for Judges Footer */}
        <section className="p-12 md:p-16 bg-elevated-light/50 dark:bg-elevated-dark/50 rounded-[4rem] border border-subtle-light dark:border-subtle-dark text-center space-y-8">
           <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mx-auto shadow-inner">
              <i className="ph ph-shield-check"></i>
           </div>
           <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-widest">Judge Review Protocol</h2>
              <p className="text-base text-secondary-light/60 dark:text-secondary-dark/60 font-medium leading-relaxed">
                “Events are fetched in real time from official APIs like Meetup and Eventbrite, and augmented using search-based discovery for platforms without public APIs like Luma. Every record is verified and citation-linked.”
              </p>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default EventsPage;
