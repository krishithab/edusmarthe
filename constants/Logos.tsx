
import React from 'react';

/**
 * Maps common educational and tech domains to professional Phosphor icons.
 * This maintains a clean, institutional aesthetic without external image dependencies.
 */
export const getIconForDomain = (domain?: string, name?: string): string => {
  const target = (domain || name || '').toLowerCase();

  // Institutional Ecosystem Partners
  if (target.includes('t-hub') || target.includes('thub')) return 'ph ph-rocket-launch';
  if (target.includes('wehub') || target.includes('we hub')) return 'ph ph-flower';
  if (target.includes('startupindia')) return 'ph ph-flag';
  
  // Tech & Engineering
  if (target.includes('google')) return 'ph ph-google-logo';
  if (target.includes('meta')) return 'ph ph-meta-logo';
  if (target.includes('apple')) return 'ph ph-apple-logo';
  if (target.includes('microsoft')) return 'ph ph-microsoft-logo';
  if (target.includes('amazon')) return 'ph ph-amazon-logo';
  if (target.includes('nvidia')) return 'ph ph-cpu';
  if (target.includes('openai')) return 'ph ph-sparkle';
  if (target.includes('intel')) return 'ph ph-circuit-board';
  if (target.includes('ibm')) return 'ph ph-cloud';
  
  // VC & Accelerators
  if (target.includes('sequoia') || target.includes('a16z') || target.includes('ycombinator') || target.includes('techstars')) return 'ph ph-bank';
  if (target.includes('stripe')) return 'ph ph-credit-card';
  
  // Default fallback
  return 'ph ph-buildings';
};

interface InstitutionalLogoProps {
  domain?: string;
  name?: string;
  className?: string;
}

/**
 * Renders a verified institutional logo using Clearbit with a robust icon fallback.
 */
export const InstitutionalLogo: React.FC<InstitutionalLogoProps> = ({ domain, name, className = "text-xl" }) => {
  const [imgError, setImgError] = React.useState(false);
  const iconClass = getIconForDomain(domain, name);
  
  // Clean domain for Clearbit
  const cleanDomain = domain?.replace('https://', '').replace('http://', '').split('/')[0];

  if (cleanDomain && !imgError) {
    return (
      <img 
        src={`https://logo.clearbit.com/${cleanDomain}`} 
        alt={name || domain}
        className={`${className} object-contain max-h-full max-w-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center text-secondary-light/40 dark:text-secondary-dark/40 ${className}`}>
      <i className={iconClass}></i>
    </div>
  );
};

interface ProfessionalAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

export const ProfessionalAvatar: React.FC<ProfessionalAvatarProps> = ({ src, name, className = "size-12" }) => {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return (
      <div className={`${className} bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400`}>
        <i className="ph ph-user text-xl"></i>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden bg-white dark:bg-slate-900`}>
      <img 
        src={src} 
        alt={name || 'User Avatar'} 
        onError={() => setError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
