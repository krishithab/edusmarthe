
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import { Post, Comment } from '../types';
import { ProfessionalAvatar } from '../constants/Logos';
import { ECOSYSTEM_COMMUNITIES } from '../constants/Communities';
import { networkService } from '../services/networkService';

const NetworkFeed: React.FC = () => {
  const { user, addXP, addNotification } = useUser();
  const [postContent, setPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'HOT' | 'NEW' | 'TOP' | 'COMMUNITIES'>('HOT');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track open comment sections and their local inputs
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<Record<string, boolean>>({});

  const loadPosts = useCallback(async () => {
    try {
      const data = await networkService.fetchPosts();
      const formattedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        author: p.author_name || 'Anonymous Innovator',
        authorRole: p.flair || 'Ecosystem Candidate',
        timestamp: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
        content: p.content,
        votes: p.votes?.reduce((acc: number, v: any) => acc + (v.type === 'UP' ? 1 : -1), 0) || 0,
        commentsCount: 0, 
        likedBy: p.votes?.filter((v: any) => v.type === 'UP').map((v: any) => v.user_id) || [],
        downvotedBy: p.votes?.filter((v: any) => v.type === 'DOWN').map((v: any) => v.user_id) || [],
        avatar: p.avatar_url,
        verified: true,
        flair: p.flair
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.error("Feed Sync Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadComments = async (postId: string) => {
    try {
      const data = await networkService.fetchComments(postId);
      const formatted: Comment[] = data.map((c: any) => ({
        id: c.id,
        author: c.author_name,
        authorId: c.user_id,
        avatar: c.avatar_url,
        content: c.content,
        timestamp: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        votes: 0
      }));
      setPostComments(prev => ({ ...prev, [postId]: formatted }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: formatted.length } : p));
    } catch (err) {
      console.error("Comment Load Error:", err);
    }
  };

  useEffect(() => {
    loadPosts();
    const subscription = networkService.subscribeToChanges(() => {
      loadPosts(); 
      Object.keys(openComments).forEach(id => {
        if (openComments[id]) loadComments(id);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadPosts, openComments]);

  const handlePost = async () => {
    if (!postContent.trim() || !user.id) {
      if (!user.id) addNotification("Please log in to broadcast.", "warning");
      return;
    }
    
    try {
      await networkService.createPost(
        postContent, 
        user.id, 
        user.name, 
        user.avatar, 
        user.tagline
      );
      setPostContent('');
      addXP(100);
      addNotification("Broadcast shared!", "success");
    } catch (err) {
      addNotification("Broadcast failure.", "error");
    }
  };

  const handleReply = async (postId: string) => {
    const content = replyInputs[postId];
    if (!content?.trim() || !user.id) return;

    setIsSubmittingReply(prev => ({ ...prev, [postId]: true }));
    try {
      await networkService.createComment(postId, content, user.id, user.name, user.avatar);
      setReplyInputs(prev => ({ ...prev, [postId]: '' }));
      addXP(50);
      addNotification("Reply committed.", "success");
      loadComments(postId); 
    } catch (err) {
      addNotification("Reply delivery failed.", "error");
    } finally {
      setIsSubmittingReply(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!openComments[postId]) {
      loadComments(postId);
    }
  };

  const handleVote = async (id: string, type: 'UP' | 'DOWN') => {
    if (!user.id) {
      addNotification("Identity verification required.", "info");
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const alreadyVoted = p.likedBy?.includes(user.id!) || p.downvotedBy?.includes(user.id!);
      if (alreadyVoted) return p; 
      const isUp = type === 'UP';
      return { ...p, votes: p.votes + (isUp ? 1 : -1) };
    }));

    try {
      await networkService.castVote(id, user.id, type);
      if (type === 'UP') addXP(5);
    } catch (err) {
      addNotification("Network synergy interrupted.", "warning");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'TOP') return b.votes - a.votes;
    if (activeTab === 'NEW') return b.id.localeCompare(a.id);
    return b.votes + (postComments[b.id]?.length || 0) - (a.votes + (postComments[a.id]?.length || 0)); 
  });

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="prof-card overflow-hidden border-primary/10 bg-surface-light dark:bg-surface-dark shadow-sm">
            <div className="h-24 bg-primary/10" />
            <div className="px-6 pb-8 relative -mt-12 text-center">
              <div className="flex justify-center mb-4">
                <ProfessionalAvatar src={user.avatar} name={user.name} className="size-24 !rounded-3xl border-4 border-surface-light dark:border-surface-dark shadow-2xl" />
              </div>
              <h3 className="text-xl font-black">{user.name}</h3>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Ecosystem karma: {user.xp}</p>
              
              <div className="mt-8 pt-8 border-t border-subtle-light dark:border-subtle-dark space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-secondary-light/60">
                    <span>Paths Enrolled</span>
                    <span className="text-primary">{user.enrolledCourses.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-secondary-light/60">
                    <span>Credentials</span>
                    <span className="text-primary">{user.badges.length}</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-8 prof-card space-y-6 bg-surface-light dark:bg-surface-dark border-subtle-light dark:border-subtle-dark">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-light/40">Hub Communities</h4>
             <div className="space-y-2">
                {['T-Hub Scaling', 'WE Hub Empower', 'Venture Lab', 'Institutional AI'].map(hub => (
                  <button key={hub} className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold text-secondary-light/80 dark:text-secondary-dark/80 hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-3 group">
                     <i className="ph ph-hash text-primary/40 group-hover:text-primary transition-colors"></i> {hub}
                  </button>
                ))}
             </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          {/* New Post Box */}
          <div className="p-6 md:p-8 prof-card border-primary/20 shadow-xl shadow-primary/5 bg-surface-light dark:bg-surface-dark">
            <div className="flex gap-4 md:gap-6">
              <ProfessionalAvatar src={user.avatar} name={user.name} className="size-12 md:size-14 shrink-0 shadow-lg" />
              <div className="flex-1 space-y-4">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-elevated-light dark:bg-elevated-dark border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none min-h-[100px] md:min-h-[120px] resize-none placeholder:text-secondary-light/20"
                  placeholder="Broadcast to the ecosystem..."
                />
                <div className="flex justify-end items-center">
                   <button 
                    onClick={handlePost}
                    disabled={!postContent.trim()}
                    className="btn-primary py-2.5 md:py-3 px-8 md:px-10 text-[9px] md:text-[10px] shadow-primary/20"
                   >
                    Commit Broadcast
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-elevated-light dark:bg-elevated-dark rounded-2xl w-fit border border-subtle-light dark:border-subtle-dark">
             {(['HOT', 'NEW', 'TOP', 'COMMUNITIES'] as const).map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-secondary-light/40 hover:text-primary-light'}`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6 opacity-40">
                <i className="ph ph-spinner animate-spin text-5xl text-primary"></i>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Syncing Hub Data...</p>
              </div>
            ) : activeTab === 'COMMUNITIES' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                {ECOSYSTEM_COMMUNITIES.map((community, idx) => (
                  <div key={idx} className="prof-card p-10 flex flex-col justify-between hover:border-primary/30 transition-all group bg-surface-light dark:bg-surface-dark shadow-sm">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="size-16 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary text-3xl shadow-inner group-hover:scale-110 transition-transform">
                          <i className={community.icon}></i>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">{community.members} Members</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-black group-hover:text-primary transition-colors">{community.name}</h4>
                        <p className="text-xs text-secondary-light/60 dark:text-secondary-dark/60 font-medium mt-3 leading-relaxed line-clamp-2">{community.description}</p>
                      </div>
                    </div>
                    <button className="mt-10 w-full py-4 bg-elevated-light dark:bg-elevated-dark border border-subtle-light dark:border-subtle-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                      Establish Connection
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              sortedPosts.map((post) => {
                const userId = user.id || 'me';
                const isLiked = post.likedBy?.includes(userId);
                const isDownvoted = post.downvotedBy?.includes(userId);
                const isCommentsOpen = openComments[post.id];
                const comments = postComments[post.id] || [];

                return (
                  <div key={post.id} className="prof-card flex flex-col group hover:border-primary/20 transition-all overflow-hidden bg-surface-light dark:bg-surface-dark shadow-sm">
                    <div className="flex">
                        <div className="w-12 md:w-16 shrink-0 bg-elevated-light/30 dark:bg-elevated-dark/30 flex flex-col items-center py-6 md:py-8 gap-3 md:gap-4 border-r border-subtle-light dark:border-subtle-dark">
                        <button 
                            onClick={() => handleVote(post.id, 'UP')}
                            className={`text-2xl md:text-3xl transition-all hover:scale-125 ${isLiked ? 'text-primary' : 'text-secondary-light/20 hover:text-primary'}`}
                        >
                            <i className={`ph ${isLiked ? 'ph-arrow-fat-up-fill' : 'ph-arrow-fat-up'}`}></i>
                        </button>
                        <span className="text-xs md:text-sm font-black text-primary-light dark:text-primary-dark">{post.votes}</span>
                        <button 
                            onClick={() => handleVote(post.id, 'DOWN')}
                            className={`text-2xl md:text-3xl transition-all hover:scale-125 ${isDownvoted ? 'text-rose-500' : 'text-secondary-light/20 hover:text-rose-500'}`}
                        >
                            <i className={`ph ${isDownvoted ? 'ph-arrow-fat-down-fill' : 'ph-arrow-fat-down'}`}></i>
                        </button>
                        </div>
                        
                        <div className="flex-1 p-6 md:p-10 space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                            <ProfessionalAvatar src={post.avatar} name={post.author} className="size-10 md:size-12 shadow-sm" />
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <h4 className="font-black text-sm md:text-base group-hover:text-primary transition-colors">{post.author}</h4>
                                {post.flair && <span className="w-fit px-2 py-0.5 bg-primary/10 text-primary text-[7px] md:text-[8px] font-black uppercase rounded-lg tracking-widest border border-primary/20">{post.flair}</span>}
                                </div>
                                <p className="text-[8px] md:text-[10px] text-secondary-light/40 dark:text-secondary-dark/40 font-bold uppercase tracking-widest mt-0.5 md:mt-1">{post.authorRole} • {post.timestamp}</p>
                            </div>
                            </div>
                        </div>

                        <p className="text-base md:text-lg leading-relaxed text-secondary-light dark:text-secondary-dark font-medium">{post.content}</p>
                        
                        <div className="flex items-center gap-6 md:gap-10 pt-4 md:pt-6 border-t border-subtle-light dark:border-subtle-dark">
                            <button 
                                onClick={() => toggleComments(post.id)}
                                className={`flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${isCommentsOpen ? 'text-primary' : 'text-secondary-light/40'}`}
                            >
                                <i className={`ph ${isCommentsOpen ? 'ph-chat-circle-dots-fill' : 'ph-chat-circle'} text-xl md:text-2xl`}></i>
                                {post.commentsCount || comments.length} Conversations
                            </button>
                        </div>
                        </div>
                    </div>

                    {/* Comment Terminal */}
                    {isCommentsOpen && (
                        <div className="bg-elevated-light/50 dark:bg-elevated-dark/50 border-t border-subtle-light dark:border-subtle-dark p-6 md:p-10 animate-in slide-in-from-top-4 duration-300">
                            <div className="space-y-6 mb-8">
                                {comments.length === 0 ? (
                                    <div className="flex flex-col items-center py-6 opacity-30 text-center">
                                       <i className="ph ph-mask-sad text-3xl mb-2"></i>
                                       <p className="text-[9px] font-black uppercase tracking-widest">Neural Silence: No replies yet</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 md:gap-4 group/comment animate-in fade-in">
                                            <ProfessionalAvatar src={comment.avatar} name={comment.author} className="size-8 md:size-10 shrink-0" />
                                            <div className="flex-1 bg-surface-light dark:bg-surface-dark p-4 md:p-5 rounded-2xl border border-subtle-light dark:border-subtle-dark shadow-sm">
                                                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                                                    <h5 className="font-black text-[11px] md:text-xs text-primary">{comment.author}</h5>
                                                    <span className="text-[7px] md:text-[8px] font-bold opacity-30 uppercase tracking-widest">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-xs md:text-sm text-secondary-light dark:text-secondary-dark font-medium leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Reply Input */}
                            <div className="flex gap-3 md:gap-4 items-start pt-6 border-t border-subtle-light dark:border-subtle-dark">
                                <ProfessionalAvatar src={user.avatar} name={user.name} className="size-8 md:size-10 shrink-0" />
                                <div className="flex-1 flex gap-2">
                                    <input 
                                        value={replyInputs[post.id] || ''}
                                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && handleReply(post.id)}
                                        placeholder="Add to the conversation..."
                                        className="flex-1 bg-white dark:bg-slate-900 border border-subtle-light dark:border-subtle-dark rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-medium outline-none focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <button 
                                        onClick={() => handleReply(post.id)}
                                        disabled={!replyInputs[post.id]?.trim() || isSubmittingReply[post.id]}
                                        className="size-10 md:size-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                                    >
                                        {isSubmittingReply[post.id] ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-paper-plane-tilt text-lg md:text-xl"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NetworkFeed;
