
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Badge, SocialProfile, EnrolledCourse, Experience, UserRole, UserPreferences, MentorshipRequest, VentureAnalysis } from '../types';
import { supabase } from '../services/supabaseClient';
import { generateMentorResponse } from '../services/geminiService';

interface UserProfile {
  id?: string;
  name: string;
  role: UserRole;
  level: number;
  xp: number;
  xpToNextLevel: number;
  interests: string[];
  avatar: string;
  badges: Badge[];
  enrolledCourses: EnrolledCourse[];
  socialProfiles: SocialProfile[];
  experience: Experience[];
  mentorshipRequests: MentorshipRequest[];
  pitches: VentureAnalysis[];
  bio?: string;
  tagline?: string;
  preferences: UserPreferences;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

interface UserContextType {
  user: UserProfile;
  session: any | null;
  loading: boolean;
  addXP: (amount: number) => void;
  updateInterests: (interests: string[]) => void;
  lastXPGain: number | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  savedEventIds: string[];
  registeredEventIds: string[];
  toggleSaveEvent: (eventId: string) => void;
  toggleRegisterEvent: (eventId: string, eventTitle: string) => void;
  enrollCourse: (course: Omit<EnrolledCourse, 'status' | 'enrolledAt'>) => void;
  completeCourse: (courseId: string) => void;
  updateSocialProfiles: (profiles: SocialProfile[]) => void;
  updateExperience: (experience: Experience[]) => void;
  savePitch: (pitch: VentureAnalysis) => void;
  sendMentorshipRequest: (mentorId: string, mentorName: string, mentorRole: string) => Promise<void>;
  awardBadge: (badge: Badge) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  notifications: Notification[];
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = 'smartedu_user_data';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  notificationsEnabled: true,
  publicProfile: true,
  marketingEmails: false,
  compactMode: false
};

const DEFAULT_USER: UserProfile = {
  name: 'Guest Innovator',
  role: UserRole.STUDENT,
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  interests: [],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  badges: [],
  enrolledCourses: [],
  experience: [],
  mentorshipRequests: [],
  pitches: [],
  tagline: 'Future Founder',
  socialProfiles: [
    { platform: 'GitHub', url: '', icon: 'code' },
    { platform: 'LinkedIn', url: '', icon: 'work' },
    { platform: 'Portfolio', url: '', icon: 'language' }
  ],
  preferences: DEFAULT_PREFERENCES
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const syncTimeout = useRef<any>(null);
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [lastXPGain, setLastXPGain] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    user.preferences.theme || 'dark'
  );
  
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_saved_events`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_registered_events`);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const hydrateUser = (supabaseUser: any) => {
    if (!supabaseUser) return;
    const meta = supabaseUser.user_metadata;
    
    setUser(prev => {
      const updated = {
        ...prev,
        id: supabaseUser.id,
        name: meta?.full_name || prev.name,
        role: meta?.role || prev.role,
        interests: meta?.interests || prev.interests || [],
        xp: typeof meta?.xp === 'number' ? meta.xp : prev.xp,
        level: typeof meta?.level === 'number' ? meta.level : prev.level,
        badges: Array.isArray(meta?.badges) ? meta.badges : prev.badges,
        avatar: meta?.avatar || prev.avatar,
        tagline: meta?.tagline || prev.tagline,
        xpToNextLevel: meta?.xpToNextLevel || prev.xpToNextLevel || 1000,
        enrolledCourses: Array.isArray(meta?.enrolled_courses) ? meta.enrolled_courses : prev.enrolledCourses,
        socialProfiles: Array.isArray(meta?.social_profiles) ? meta.social_profiles : prev.socialProfiles,
        experience: Array.isArray(meta?.experience) ? meta.experience : prev.experience || [],
        mentorshipRequests: Array.isArray(meta?.mentorship_requests) ? meta.mentorship_requests : prev.mentorshipRequests || [],
        pitches: Array.isArray(meta?.pitches) ? meta.pitches : prev.pitches || [],
        bio: meta?.bio || prev.bio,
        preferences: meta?.preferences || prev.preferences || DEFAULT_PREFERENCES
      };
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(updated));
      if (updated.preferences.theme) setTheme(updated.preferences.theme);
      return updated;
    });

    if (Array.isArray(meta?.saved_event_ids)) {
      setSavedEventIds(meta.saved_event_ids);
      localStorage.setItem(`${STORAGE_KEY}_saved_events`, JSON.stringify(meta.saved_event_ids));
    }
    if (Array.isArray(meta?.registered_event_ids)) {
      setRegisteredEventIds(meta.registered_event_ids);
      localStorage.setItem(`${STORAGE_KEY}_registered_events`, JSON.stringify(meta.registered_event_ids));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession?.user) hydrateUser(currentSession.user);
      } catch (err) {
        addNotification("Session check failed.", "error");
      } finally {
        setLoading(false);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        hydrateUser(newSession.user);
      } else {
        setUser(DEFAULT_USER);
        setSavedEventIds([]);
        setRegisteredEventIds([]);
        localStorage.removeItem(`${STORAGE_KEY}_profile`);
        localStorage.removeItem(`${STORAGE_KEY}_saved_events`);
        localStorage.removeItem(`${STORAGE_KEY}_registered_events`);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncToCloud = (updatedData: any) => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      if (session?.user) {
        try {
          await supabase.auth.updateUser({ data: updatedData });
        } catch (e) {
          console.error("Cloud sync exception:", e);
        }
      }
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      updatePreferences({ theme: next });
      return next;
    });
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUser(prev => {
      const updated = { ...prev, preferences: { ...prev.preferences, ...prefs } };
      syncToCloud({ preferences: updated.preferences });
      return updated;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      syncToCloud({ 
        full_name: updated.name,
        bio: updated.bio,
        avatar: updated.avatar,
        tagline: updated.tagline,
        role: updated.role
      });
      return updated;
    });
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newNextLevel = prev.xpToNextLevel;

      if (newXP >= prev.xpToNextLevel) {
        newLevel += 1;
        newXP -= prev.xpToNextLevel;
        newNextLevel = Math.floor(prev.xpToNextLevel * 1.2);
        addNotification(`Synergy Bonus: Level ${newLevel} Reached!`, 'success');
      }
      
      const updatedUser = { ...prev, xp: newXP, level: newLevel, xpToNextLevel: newNextLevel };
      syncToCloud({ xp: updatedUser.xp, level: updatedUser.level, xpToNextLevel: updatedUser.xpToNextLevel });
      return updatedUser;
    });
    setLastXPGain(amount);
    setTimeout(() => setLastXPGain(null), 2000);
  };

  const enrollCourse = (course: Omit<EnrolledCourse, 'status' | 'enrolledAt'>) => {
    if (user.enrolledCourses.some(c => c.id === course.id)) return;
    const newEnrollment: EnrolledCourse = {
      ...course,
      status: 'enrolled',
      enrolledAt: new Date().toISOString()
    };
    setUser(prev => {
      const updated = { ...prev, enrolledCourses: [...prev.enrolledCourses, newEnrollment] };
      syncToCloud({ enrolled_courses: updated.enrolledCourses });
      return updated;
    });
    addNotification(`Enrolled: ${course.title}.`, 'success');
  };

  const completeCourse = (courseId: string) => {
    setUser(prev => {
      const updatedCourses = prev.enrolledCourses.map(c => 
        c.id === courseId ? { ...c, status: 'completed' as const } : c
      );
      const updated = { ...prev, enrolledCourses: updatedCourses };
      syncToCloud({ enrolled_courses: updated.enrolledCourses });
      return updated;
    });
    addNotification(`Certification achieved!`, 'success');
  };

  const updateSocialProfiles = (profiles: SocialProfile[]) => {
    setUser(prev => {
      const updated = { ...prev, socialProfiles: profiles };
      syncToCloud({ social_profiles: updated.socialProfiles });
      return updated;
    });
  };

  const updateExperience = (experience: Experience[]) => {
    setUser(prev => {
      const updated = { ...prev, experience };
      syncToCloud({ experience: updated.experience });
      return updated;
    });
  };

  const savePitch = (pitch: VentureAnalysis) => {
    setUser(prev => {
      const updated = { ...prev, pitches: [pitch, ...(prev.pitches || [])] };
      syncToCloud({ pitches: updated.pitches });
      return updated;
    });
  };

  const sendMentorshipRequest = async (mentorId: string, mentorName: string, mentorRole: string) => {
    if (user.mentorshipRequests.some(r => r.mentorId === mentorId)) {
      addNotification("Synergy request is already pending.", "warning");
      return;
    }

    const newRequest: MentorshipRequest = {
      id: Math.random().toString(36).substr(2, 9),
      mentorId,
      mentorName,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    setUser(prev => {
      const updated = { ...prev, mentorshipRequests: [...prev.mentorshipRequests, newRequest] };
      syncToCloud({ mentorship_requests: updated.mentorshipRequests });
      return updated;
    });

    addNotification(`Synergy request dispatched to ${mentorName}.`, "success");

    setTimeout(async () => {
      try {
        const response = await generateMentorResponse(mentorName, mentorRole, user.interests);
        setUser(prev => {
          const updatedRequests = prev.mentorshipRequests.map(r => 
            r.mentorId === mentorId ? { ...r, status: 'accepted' as const, mentorResponse: response } : r
          );
          const updated = { ...prev, mentorshipRequests: updatedRequests };
          syncToCloud({ mentorship_requests: updated.mentorshipRequests });
          return updated;
        });
        addNotification(`${mentorName} accepted your synergy request!`, "success");
        addXP(200);
      } catch (e) {
        console.error("AI Mentor Simulation exception:", e);
      }
    }, 5000);
  };

  const toggleRegisterEvent = (eventId: string, eventTitle: string) => {
    const isRegistered = registeredEventIds.includes(eventId);
    
    if (isRegistered) {
      const confirmUnregister = window.confirm(`Release seat for "${eventTitle}"? This will allow another ecosystem participant to claim this institutional slot.`);
      if (confirmUnregister) {
        setRegisteredEventIds(prev => {
          const newList = prev.filter(id => id !== eventId);
          localStorage.setItem(`${STORAGE_KEY}_registered_events`, JSON.stringify(newList));
          syncToCloud({ registered_event_ids: newList });
          return newList;
        });
        addNotification(`Seat released for ${eventTitle}.`, 'info');
      }
    } else {
      setRegisteredEventIds(prev => {
        const newList = [...prev, eventId];
        localStorage.setItem(`${STORAGE_KEY}_registered_events`, JSON.stringify(newList));
        syncToCloud({ registered_event_ids: newList });
        return newList;
      });
      addNotification(`Synergy established with ${eventTitle}! +150 XP`, 'success');
      addXP(150);
    }
  };

  const toggleSaveEvent = (eventId: string) => {
    setSavedEventIds(prev => {
      const exists = prev.includes(eventId);
      const newList = exists ? prev.filter(id => id !== eventId) : [...prev, eventId];
      localStorage.setItem(`${STORAGE_KEY}_saved_events`, JSON.stringify(newList));
      syncToCloud({ saved_event_ids: newList });
      return newList;
    });
  };

  const awardBadge = (badge: Badge) => {
    setUser(prev => {
      if (prev.badges.some(b => b.id === badge.id)) return prev;
      addNotification(`Credential Gained: ${badge.name}`, 'success');
      const updatedBadges = [...prev.badges, badge];
      syncToCloud({ badges: updatedBadges });
      return { ...prev, badges: updatedBadges };
    });
  };

  const updateInterests = (interests: string[]) => {
    setUser(prev => ({ ...prev, interests }));
    syncToCloud({ interests });
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message, type, time: 'Just now' }, ...prev].slice(0, 3));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.removeItem(`${STORAGE_KEY}_profile`);
      localStorage.removeItem(`${STORAGE_KEY}_registered_events`);
      localStorage.removeItem(`${STORAGE_KEY}_saved_events`);
      setSession(null);
      setUser(DEFAULT_USER);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, session, loading, addXP, updateInterests, lastXPGain, 
      theme, toggleTheme, 
      savedEventIds, registeredEventIds, toggleSaveEvent, toggleRegisterEvent,
      enrollCourse, completeCourse, updateSocialProfiles, updateExperience,
      savePitch,
      sendMentorshipRequest,
      awardBadge, updatePreferences, updateProfile,
      notifications, addNotification, signOut
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
