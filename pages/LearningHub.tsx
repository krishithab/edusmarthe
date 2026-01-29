
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { searchRealTimeCourses } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { InstitutionalLogo } from '../constants/Logos';

const STATIC_CATALOG = [
  { id: 'g1', title: 'Introduction to Generative AI', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/536' },
  { id: 'g2', title: 'Introduction to Large Language Models', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/539' },
  { id: 'g3', title: 'Introduction to Responsible AI', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/554' },
  { id: 'g4', title: 'Generative AI Fundamentals', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/556' },
  { id: 'g5', title: 'Introduction to Image Generation', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/541' },
  { id: 'g6', title: 'Introduction to Generative AI Studio', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/552' },
  { id: 'g7', title: 'Create Image Captioning Models', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/542' },
  { id: 'g8', title: 'Introduction to Generative AI for Developers', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/537' },
  { id: 'g9', title: 'Generative AI for Business Leaders', provider: 'Google Cloud', domain: 'google.com', link: 'https://www.cloudskillsboost.google/course_templates/599' },
  { id: 's2', title: 'Data Science Specialization', provider: 'IBM', domain: 'ibm.com', link: 'https://www.coursera.org/specializations/ibm-data-science' },
  { id: 's3', title: 'Full Stack Development', provider: 'Meta', domain: 'facebook.com', link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' }
];

const LearningHub: React.FC = () => {
  const { user, enrollCourse, completeCourse, addNotification } = useUser();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await searchRealTimeCourses(topic);
      setResults({ text: res.text, links: res.groundingLinks });
    } catch (e: any) {
      const errorMsg = e.message?.includes('503') ? "AI systems are currently overloaded. Retrying failed. Please wait a moment." : "Search encountered an exception.";
      addNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollAction = (e: React.MouseEvent, course: any) => {
    e.stopPropagation();
    enrollCourse({
      id: course.id || `course-${Math.random().toString(36).substr(2, 5)}`,
      title: course.title,
      provider: course.provider || course.domain || 'External',
      link: course.uri || course.link,
      domain: course.domain
    });
    window.open(course.uri || course.link, '_blank');
  };

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addNotification("Course link copied!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  };

  const enrolledOnly = user.enrolledCourses.filter(c => c.status === 'enrolled');

  return (
    <Layout>
      <div className="space-y-16 pb-20">
        <div className="relative p-10 md:p-16 rounded-[4rem] bg-slate-900 overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-3xl space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">Neural Learning Lab</h1>
            <p className="text-slate-400 text-lg">AI Discovery finds the best live certifications from verified global platforms based on market demand.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                placeholder="Topic: Generative AI, MLOps, UX..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary outline-none"
              />
              <button onClick={handleSearch} disabled={loading} className="px-10 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/30 h-16 sm:h-auto flex items-center justify-center gap-2">
                {loading ? <i className="ph ph-spinner animate-spin text-xl"></i> : <i className="ph ph-sparkle text-xl"></i>}
                {loading ? 'Searching...' : 'Discover Pathways'}
              </button>
            </div>
          </div>
        </div>

        {enrolledOnly.length > 0 && (
          <section className="space-y-8 p-10 bg-primary/5 rounded-[3rem] border border-primary/20">
            <div className="flex items-center gap-4">
               <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <i className="ph ph-target text-2xl"></i>
               </div>
               <h2 className="text-2xl font-black">Active Growth Pathways</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {enrolledOnly.map(course => (
                 <div 
                  key={course.id} 
                  onClick={() => handleCardClick(course.link)}
                  className="bg-white dark:bg-[#1a2632] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between group hover:border-primary transition-all cursor-pointer hover:shadow-xl"
                 >
                    <div className="flex gap-4 mb-6">
                       <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shrink-0 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <InstitutionalLogo domain={course.domain} name={course.provider} className="text-3xl" />
                       </div>
                       <div>
                          <h4 className="font-black text-base line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{course.provider}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={(e) => { e.stopPropagation(); window.open(course.link, '_blank'); }} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Resume Path</button>
                       <button onClick={(e) => { e.stopPropagation(); completeCourse(course.id); }} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">Mark Complete</button>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        )}

        {results && (
          <section className="space-y-8 animate-in slide-in-from-bottom-10">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                 <i className="ph ph-sparkle text-2xl"></i>
              </div>
              <h2 className="text-2xl font-black">Neural Recommendations</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.links.map((link, idx) => {
                const isEnrolled = user.enrolledCourses.some(c => c.id === `ai-course-${idx}`);
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCardClick(link.uri)}
                    className="bg-white dark:bg-[#1a2632] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-primary transition-all group flex flex-col cursor-pointer hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="size-16 rounded-[1.8rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform shadow-sm">
                        <InstitutionalLogo domain={link.domain} name={link.title} className="text-4xl" />
                      </div>
                      <button onClick={(e) => handleCopy(e, `ai-course-${idx}`, link.uri)} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-primary transition-colors">
                         <i className={copiedId === `ai-course-${idx}` ? 'ph ph-check' : 'ph ph-copy'}></i>
                      </button>
                    </div>
                    <h3 className="font-black text-lg mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">{link.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">{link.domain || 'Verified Partner'}</p>
                    <div className="mt-auto">
                      <button 
                        onClick={(e) => handleEnrollAction(e, {...link, id: `ai-course-${idx}`})}
                        disabled={isEnrolled}
                        className={`w-full py-4 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/5 active:scale-95 ${
                          isEnrolled ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]'
                        }`}
                      >
                        {isEnrolled ? 'Success Enrollment' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Global Institutional Catalog</h2>
            <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">Free Paths Prioritized</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {STATIC_CATALOG.map(course => {
               const isEnrolled = user.enrolledCourses.some(c => c.id === course.id);
               return (
                <div 
                  key={course.id} 
                  onClick={() => handleCardClick(course.link)}
                  className="p-10 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-white/5 rounded-[3.5rem] shadow-sm flex flex-col justify-between group hover:border-primary transition-all hover:shadow-2xl cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm group-hover:scale-110 transition-transform">
                        <InstitutionalLogo domain={course.domain} name={course.provider} className="text-4xl" />
                      </div>
                      <button onClick={(e) => handleCopy(e, course.id, course.link)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                         <i className={copiedId === course.id ? 'ph ph-check' : 'ph ph-copy'}></i>
                      </button>
                    </div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Provider: {course.provider}</p>
                  </div>
                  <button 
                    onClick={(e) => handleEnrollAction(e, course)}
                    disabled={isEnrolled}
                    className={`w-full py-5 font-black rounded-2xl shadow-xl transition-all text-[10px] uppercase tracking-widest ${
                      isEnrolled ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary text-white shadow-primary/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isEnrolled ? 'Path Active' : 'Start Path'}
                  </button>
                </div>
               );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LearningHub;
