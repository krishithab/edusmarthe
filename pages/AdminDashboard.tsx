
import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { useUser } from '../context/UserContext';
import { networkService } from '../services/networkService';

const AdminDashboard: React.FC = () => {
  const { addNotification } = useUser();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'xp', direction: 'desc' });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await networkService.fetchStudents();
        setStudents(data);
      } catch (err) {
        addNotification("Network error. Visualizing offline institutional registry.", "warning");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const sortedAndFilteredStudents = useMemo(() => {
    let list = [...students];
    
    // Search Filter
    if (searchQuery) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.study_level?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    list.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a];
      const bVal = b[sortConfig.key as keyof typeof b];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, searchQuery, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportReport = () => {
    addNotification("Generating comprehensive institutional report...", "info");
    const headers = ["ID", "Student Name", "XP", "Level", "Track"];
    const rows = sortedAndFilteredStudents.map(s => [s.id, s.name, s.xp.toString(), s.level.toString(), s.study_level || 'General']);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Institutional_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Registry exported successfully!", "success");
  };

  return (
    <Layout>
      <div className="space-y-12 pb-20 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
              <i className="ph ph-shield-check"></i> Root Level Authorization
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary-light dark:text-primary-dark leading-none">Institute Access</h1>
            <p className="text-secondary-light dark:text-secondary-dark font-medium max-w-2xl leading-relaxed text-lg">
              Authorized monitoring of institutional health and student career trajectory mapping.
            </p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <button 
              onClick={handleExportReport}
              className="btn-primary flex-1 lg:flex-none py-5 px-10 text-[10px] shadow-primary/20"
            >
              <i className="ph ph-download-simple text-xl"></i>
              Export Student Registry
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Enrolled Nodes', val: students.length.toString(), change: '+12%', icon: 'ph ph-users' },
            { label: 'Avg Persistence', val: '94.2%', change: '+2%', icon: 'ph ph-chart-line-up' },
            { label: 'Market Readiness', val: '88.5%', change: '-1%', icon: 'ph ph-rocket-launch', negative: true },
            { label: 'Institutional XP', val: students.reduce((acc, s) => acc + s.xp, 0).toLocaleString(), change: '+5%', icon: 'ph ph-sparkle' }
          ].map((s) => (
            <div key={s.label} className="p-8 prof-card bg-surface-light dark:bg-surface-dark shadow-sm border-subtle-light dark:border-subtle-dark group hover:border-primary/30 transition-all">
              <div className="flex justify-between mb-6">
                <span className="text-[10px] font-black text-secondary-light/40 dark:text-secondary-dark/40 uppercase tracking-[0.2em]">{s.label}</span>
                <i className={`${s.icon} text-2xl text-primary group-hover:scale-110 transition-transform`}></i>
              </div>
              <p className="text-3xl font-black">{s.val}</p>
              <p className={`text-[10px] font-black mt-3 px-3 py-1 rounded-lg inline-block ${s.negative ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{s.change} Delta</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12 space-y-10">
            {/* Neural Registry Terminal */}
            <section className="prof-card bg-surface-light dark:bg-surface-dark shadow-sm border-subtle-light dark:border-subtle-dark overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-8 md:p-10 border-b border-subtle-light dark:border-subtle-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h3 className="text-2xl font-black tracking-tight">Institutional Registry Terminal</h3>
                   <p className="text-[10px] font-black text-secondary-light/40 uppercase tracking-widest mt-1">Authorized Data View • Live Neural Sync</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                   <div className="relative">
                      <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-40"></i>
                      <input 
                        type="text"
                        placeholder="Search Identity or Track..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 bg-slate-50 dark:bg-slate-900 border border-subtle-light dark:border-subtle-dark rounded-xl pl-12 pr-6 py-3 text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                      />
                   </div>
                   <div className="flex gap-2">
                      <span className="size-3 bg-emerald-500 rounded-full animate-pulse self-center" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 self-center">Node Monitoring Active</span>
                   </div>
                </div>
              </div>

              <div className="overflow-x-auto flex-1 no-scrollbar min-h-[400px]">
                <table className="w-full text-left border-collapse table-auto">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-subtle-light dark:border-subtle-dark">
                      <th onClick={() => requestSort('name')} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-light/60 cursor-pointer hover:text-primary transition-colors">
                        Candidate Identity <i className={`ph ${sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'ph-caret-up' : 'ph-caret-down') : 'ph-caret-up-down'} ml-2 opacity-30`}></i>
                      </th>
                      <th onClick={() => requestSort('level')} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-light/60 text-center cursor-pointer hover:text-primary">
                        Evol LVL <i className={`ph ${sortConfig.key === 'level' ? (sortConfig.direction === 'asc' ? 'ph-caret-up' : 'ph-caret-down') : 'ph-caret-up-down'} ml-2 opacity-30`}></i>
                      </th>
                      <th onClick={() => requestSort('xp')} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-light/60 text-center cursor-pointer hover:text-primary">
                        Institutional XP <i className={`ph ${sortConfig.key === 'xp' ? (sortConfig.direction === 'asc' ? 'ph-caret-up' : 'ph-caret-down') : 'ph-caret-up-down'} ml-2 opacity-30`}></i>
                      </th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-light/60 text-center">
                        Growth Velocity
                      </th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-light/60">Trajectory Track</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle-light dark:divide-subtle-dark">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-10 py-24 text-center">
                           <div className="flex flex-col items-center gap-4 opacity-30">
                              <i className="ph ph-spinner animate-spin text-4xl text-primary"></i>
                              <p className="text-[10px] font-black uppercase tracking-widest">Establishing secure node connection...</p>
                           </div>
                        </td>
                      </tr>
                    ) : sortedAndFilteredStudents.length > 0 ? (
                      sortedAndFilteredStudents.map((s, idx) => (
                        <tr key={s.id || idx} className="hover:bg-primary/5 transition-all group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                 {s.avatar ? <img src={s.avatar} className="size-full object-contain p-1" /> : <i className="ph ph-user text-xl"></i>}
                              </div>
                              <div className="space-y-1">
                                 <div className="font-black text-sm group-hover:text-primary transition-colors">{s.name}</div>
                                 <div className="text-[8px] font-bold text-secondary-light/40 uppercase tracking-widest">ID: #{s.id?.substring(0,6) || 'INST-01'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] font-black text-secondary-light dark:text-secondary-dark border border-subtle-light dark:border-subtle-dark">LVL {s.level}</span>
                          </td>
                          <td className="px-10 py-6 text-center font-black text-primary text-base tabular-nums">{s.xp.toLocaleString()}</td>
                          <td className="px-10 py-6 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.growth_rate || 50)}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500">+{s.growth_rate || 12}%</span>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <span className="text-[9px] font-black uppercase tracking-widest opacity-60 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-subtle-light dark:border-subtle-dark whitespace-nowrap">
                                  {s.study_level || 'Ecosystem Candidate'}
                               </span>
                               {s.level > 10 && <i className="ph-fill ph-shield-star text-amber-500 text-lg" title="High Achiever"></i>}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-10 py-24 text-center">
                           <div className="flex flex-col items-center gap-4 opacity-30">
                              <i className="ph ph-warning-circle text-4xl text-rose-500"></i>
                              <p className="text-[10px] font-black uppercase tracking-widest">No student nodes matching criteria.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 border-t border-subtle-light dark:border-subtle-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <p className="text-[9px] font-black text-secondary-light/40 uppercase tracking-widest">Showing {sortedAndFilteredStudents.length} authorized records</p>
                 <div className="flex gap-2">
                    <button className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-subtle-light dark:border-subtle-dark text-secondary-light/40 hover:text-primary hover:border-primary transition-all shadow-sm">
                       <i className="ph ph-caret-left"></i>
                    </button>
                    <button className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-subtle-light dark:border-subtle-dark text-secondary-light/40 hover:text-primary hover:border-primary transition-all shadow-sm">
                       <i className="ph ph-caret-right"></i>
                    </button>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
