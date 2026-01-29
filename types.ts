
export enum UserRole {
  STUDENT = 'STUDENT',
  SCHOOL = 'SCHOOL',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  publicProfile: boolean;
  marketingEmails: boolean;
  compactMode: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  issuer?: string;
  imageUrl?: string;
  url?: string;
}

export interface SocialProfile {
  platform: string;
  url: string;
  icon: string;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  provider: string;
  link: string;
  domain?: string;
  status: 'enrolled' | 'completed';
  enrolledAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  domain?: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  status: 'pending' | 'accepted' | 'declined';
  requestDate: string;
  initialMessage?: string;
  mentorResponse?: string;
}

export interface VentureAnalysis {
  id: string;
  concept: string;
  analysis: string;
  visualUrl?: string | null;
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  timestamp: string;
  votes: number;
}

export interface Post {
  id: string;
  author: string;
  authorId?: string;
  authorRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  votes: number;
  commentsCount: number;
  comments?: Comment[];
  likedBy?: string[]; 
  downvotedBy?: string[];
  image?: string;
  verified?: boolean;
  flair?: string;
}

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  img: string;
  source: 'Meetup' | 'Eventbrite' | 'Luma' | 'T-Hub' | 'Institutional';
  url: string;
  tags: string[];
  domain?: string;
}

export interface User {
  id?: string;
  name: string;
  role: UserRole;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatar: string;
  coverImage?: string;
  badges: Badge[];
  interests: string[];
  enrolledCourses: EnrolledCourse[];
  socialProfiles: SocialProfile[];
  experience: Experience[];
  mentorshipRequests: MentorshipRequest[];
  pitches: VentureAnalysis[];
  bio?: string;
  tagline?: string;
  preferences: UserPreferences;
}
