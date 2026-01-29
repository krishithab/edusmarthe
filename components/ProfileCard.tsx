
import React from 'react';

interface ProfileCardProps {
  name: string;
  role: string;
  tagline: string;
  avatarUrl: string;
  completionPercentage: number;
  location?: string;
  connectionsCount?: number;
  verifiedSkillsCount?: number;
  registeredEventsCount?: number;
  nextStepSuggestion?: string;
  onEdit?: () => void;
  onShare?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  tagline,
  avatarUrl,
  completionPercentage,
  location,
  connectionsCount = 142,
  verifiedSkillsCount = 3,
  registeredEventsCount = 0,
  nextStepSuggestion,
  onEdit,
  onShare,
}) => {
  const progressColor = completionPercentage === 100 ? 'bg-emerald-500' : 'bg-accent-action-light dark:bg-accent-action-dark';

  return (
    <div className="prof-card p-8 flex flex-col gap-8 md:flex-row md:items-start group/card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-action-light/5 dark:bg-accent-action-dark/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="relative shrink-0 flex flex-col items-center">
        <div className="relative size-28 md:size-32">
          <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${completionPercentage === 100 ? 'border-emerald-500/30' : 'border-accent-action-light/20'} group-hover/card:scale-105 group-hover/card:border-accent-action-light/50`} />
          <div className="size-full rounded-2xl border border-subtle-light dark:border-subtle-dark bg-surface-light dark:bg-surface-dark p-1 overflow-hidden">
            <img 
              src={avatarUrl} 
              alt={`${name}'s avatar`}
              className="w-full h-full object-contain rounded-xl transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-surface-light dark:border-surface-dark ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-accent-action-light dark:bg-accent-action-dark shadow-sm'}`} title="Verified Status"></div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-primary-light dark:text-primary-dark">
                {name}
              </h1>
              <i className="ph-fill ph-seal-check text-accent-action-light dark:text-accent-action-dark text-xl" title="Institutional Verified Profile"></i>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-sm font-bold text-accent-action-light dark:text-accent-action-dark flex items-center gap-1.5">
                <i className="ph ph-briefcase"></i>
                {role}
              </p>
              {location && (
                <div className="flex items-center gap-1.5 text-secondary-light/60 dark:text-secondary-dark/60 text-xs font-medium">
                  <i className="ph ph-map-pin"></i>
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onShare && (
              <button onClick={onShare} className="px-4 py-2 bg-elevated-light dark:bg-elevated-dark rounded-xl text-xs font-black uppercase tracking-widest text-secondary-light dark:text-secondary-dark border border-subtle-light dark:border-subtle-dark hover:text-accent-action-light transition-all">
                <i className="ph ph-share-network mr-2"></i> Share
              </button>
            )}
            {onEdit && (
              <button onClick={onEdit} className="px-4 py-2 bg-accent-action-light dark:bg-accent-action-dark text-white dark:text-main-dark rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all">
                Refine Identity
              </button>
            )}
          </div>
        </div>

        <p className="text-base text-secondary-light/80 dark:text-secondary-dark/80 leading-relaxed font-medium italic border-l-2 border-subtle-light dark:border-subtle-dark pl-4">
          "{tagline}"
        </p>

        <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-secondary-light/40 dark:text-secondary-dark/40">
           <div className="flex items-center gap-1.5">
              <i className="ph ph-users text-lg text-accent-action-light/40"></i>
              <span>{connectionsCount} Connections</span>
           </div>
           <div className="flex items-center gap-1.5">
              <i className="ph ph-seal-check text-lg text-accent-action-light/40"></i>
              <span>{verifiedSkillsCount} Skills</span>
           </div>
           <div className="flex items-center gap-1.5">
              <i className="ph ph-calendar text-lg text-accent-action-light/40"></i>
              <span className="text-accent-action-light dark:text-accent-action-dark">{registeredEventsCount} Registered Events</span>
           </div>
        </div>

        <div className="pt-6 border-t border-subtle-light dark:border-subtle-dark space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-secondary-light/40 dark:text-secondary-dark/40">
            <span>Career Identity Strength</span>
            <span className={completionPercentage === 100 ? 'text-emerald-500' : 'text-accent-action-light'}>{completionPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-elevated-light dark:bg-elevated-dark rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`} 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
