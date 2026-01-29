
import { supabase } from './supabaseClient';
import { Post, Comment } from '../types';

// Session-based fallback memory for demo resilience
const _sessionMemory: Record<string, any[]> = {
  comments: [],
  votes: [],
  posts: []
};

export const networkService = {
  /**
   * Fetch all posts with a safe fallback if tables are missing
   */
  async fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, votes(user_id, type)`)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('relation "posts" does not exist')) {
          console.warn("Table 'posts' not detected. Defaulting to Institutional Broadcasts.");
          return _sessionMemory.posts.length > 0 ? _sessionMemory.posts : [
            { id: 'mock-1', author_name: 'T-Hub Admin', content: 'Welcome to the SmartEdu Ecosystem. Establish your node identity to begin.', flair: 'Institutional', created_at: new Date().toISOString(), avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', votes: [] }
          ];
        }
        throw error;
      }
      return data || [];
    } catch (err) {
      return _sessionMemory.posts;
    }
  },

  /**
   * Fetch student profiles with mock fallback
   */
  async fetchStudents() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('xp', { ascending: false });
      if (error) throw error;
      return data && data.length > 0 ? data : this.getMockStudents();
    } catch (err) {
      return this.getMockStudents();
    }
  },

  getMockStudents() {
    return [
      { id: 'usr-101', name: 'Alex Rivera', role: 'STUDENT', xp: 4850, level: 12, study_level: 'AI Engineering', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex', growth_rate: 85 },
      { id: 'usr-102', name: 'Sam Chen', role: 'STUDENT', xp: 3220, level: 9, study_level: 'Graduate Studies', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sam', growth_rate: 64 },
      { id: 'usr-103', name: 'Jordan Smith', role: 'STUDENT', xp: 5100, level: 15, study_level: 'Alumni Network', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jordan', growth_rate: 92 },
      { id: 'usr-104', name: 'Priya Das', role: 'STUDENT', xp: 2100, level: 6, study_level: 'UX Design Track', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=priya', growth_rate: 45 },
      { id: 'usr-105', name: 'Marcus Wong', role: 'STUDENT', xp: 1800, level: 5, study_level: 'Fintech Lab', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus', growth_rate: 78 },
      { id: 'usr-106', name: 'Elena Rossi', role: 'STUDENT', xp: 4200, level: 11, study_level: 'Research Scholar', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena', growth_rate: 88 },
      { id: 'usr-107', name: 'Omar Khalid', role: 'STUDENT', xp: 950, level: 3, study_level: 'Undergraduate', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=omar', growth_rate: 30 },
      { id: 'usr-108', name: 'Sarah Miller', role: 'STUDENT', xp: 3900, level: 10, study_level: 'Venture Architect', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah', growth_rate: 72 },
      { id: 'usr-109', name: 'Liam Wilson', role: 'STUDENT', xp: 1200, level: 4, study_level: 'Cybersecurity', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=liam', growth_rate: 55 },
      { id: 'usr-110', name: 'Inaya Verma', role: 'STUDENT', xp: 6000, level: 18, study_level: 'Neural Networks', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=inaya', growth_rate: 95 },
      { id: 'usr-111', name: 'Carlos Mendez', role: 'STUDENT', xp: 2700, level: 8, study_level: 'BioTech', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=carlos', growth_rate: 50 },
      { id: 'usr-112', name: 'Yuki Tanaka', role: 'STUDENT', xp: 3100, level: 9, study_level: 'Robotics', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=yuki', growth_rate: 68 },
      { id: 'usr-113', name: 'Amara Okafor', role: 'STUDENT', xp: 1500, level: 4, study_level: 'Supply Chain', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=amara', growth_rate: 42 }
    ];
  },

  /**
   * Create Post with memory fallback
   */
  async createPost(content: string, userId: string, authorName: string, avatar: string, flair?: string) {
    try {
      const { data, error } = await supabase.from('posts').insert([{ 
        content, user_id: userId, author_name: authorName, avatar_url: avatar, flair: flair || 'Innovator'
      }]).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      const mockPost = { id: `local-${Date.now()}`, content, author_name: authorName, avatar_url: avatar, flair, created_at: new Date().toISOString(), votes: [] };
      _sessionMemory.posts.unshift(mockPost);
      return mockPost;
    }
  },

  async fetchComments(postId: string) {
    try {
      const { data, error } = await supabase.from('comments').select('*').eq('post_id', postId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      return _sessionMemory.comments.filter(c => c.post_id === postId);
    }
  },

  async createComment(postId: string, content: string, userId: string, authorName: string, avatar: string) {
    try {
      const { data, error } = await supabase.from('comments').insert([{
        post_id: postId, user_id: userId, author_name: authorName, avatar_url: avatar, content
      }]).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      const mockComment = { id: `c-${Date.now()}`, post_id: postId, author_name: authorName, content, created_at: new Date().toISOString(), avatar_url: avatar };
      _sessionMemory.comments.push(mockComment);
      return mockComment;
    }
  },

  /**
   * Cast a vote for a specific broadcast node with ecosystem verification
   */
  async castVote(postId: string, userId: string, type: 'UP' | 'DOWN') {
    try {
      // Upsert vote to handle changes in sentiment from the same node
      const { error } = await supabase.from('votes').upsert({
        post_id: postId,
        user_id: userId,
        type
      }, { onConflict: 'post_id,user_id' });
      if (error) throw error;
    } catch (err) {
      // Memory fallback for demo resilience in sandboxed environments
      const vote = { user_id: userId, type };
      _sessionMemory.votes.push({ ...vote, post_id: postId });
      
      const post = _sessionMemory.posts.find(p => p.id === postId);
      if (post) {
        if (!post.votes) post.votes = [];
        // Ensure atomic update of vote for the specific user in the mock memory
        post.votes = post.votes.filter((v: any) => v.user_id !== userId);
        post.votes.push(vote);
      }
    }
  },

  subscribeToChanges(callback: () => void) {
    return supabase.channel('network-changes').on('postgres_changes', { event: '*', table: 'posts' }, callback).subscribe();
  }
};
