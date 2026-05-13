/**
 * Idea Details Page
 * Full view of a single idea with like/dislike, category, and comments
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getIdea, toggleLikeIdea, toggleDislikeIdea, deleteIdea, addComment, deleteComment } from '../services/ideaService';
import { formatDate, timeAgo, getCategoryLabel, getCategoryColor, getCategoryIcon } from '../utils/helpers';
import LoadingScreen from '../components/LoadingScreen';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Box, Card, CardContent, Typography, Button, Divider, IconButton, Tooltip,
  TextField, Avatar, Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon, ThumbUp as ThumbUpIcon, ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDown as ThumbDownIcon, ThumbDownOffAlt as ThumbDownOffAltIcon,
  Delete as DeleteIcon, Person as PersonIcon, CalendarToday as CalendarIcon,
  AccessTime as TimeIcon, Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getInitials } from '../utils/helpers';

const MotionBox = motion.create(Box);

const IdeaDetailsPage = () => {
  const { ideaId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchIdea = async () => {
    const { idea: data, error } = await getIdea(ideaId);
    if (error) { showSnackbar(error, 'error'); navigate('/dashboard'); }
    else setIdea(data);
    setLoading(false);
  };

  useEffect(() => { fetchIdea(); }, [ideaId]);

  const handleLike = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    const { error } = await toggleLikeIdea(ideaId, currentUser.uid);
    if (error) showSnackbar(error, 'error');
    else await fetchIdea();
    setActionLoading(false);
  };

  const handleDislike = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    const { error } = await toggleDislikeIdea(ideaId, currentUser.uid);
    if (error) showSnackbar(error, 'error');
    else await fetchIdea();
    setActionLoading(false);
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    const { error } = await deleteIdea(ideaId);
    if (error) showSnackbar(error, 'error');
    else { showSnackbar('Idea deleted successfully', 'success'); navigate('/dashboard'); }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    const displayName = userProfile?.displayName || currentUser?.displayName || 'User';
    const { error } = await addComment(ideaId, currentUser.uid, displayName, commentText.trim());
    if (error) showSnackbar(error, 'error');
    else {
      setCommentText('');
      await fetchIdea();
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (comment) => {
    const { error } = await deleteComment(ideaId, comment);
    if (error) showSnackbar(error, 'error');
    else await fetchIdea();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (loading) return <LoadingScreen message="Loading idea..." />;
  if (!idea) return null;

  const hasLiked = idea.likes?.includes(currentUser?.uid);
  const hasDisliked = idea.dislikes?.includes(currentUser?.uid);
  const likesCount = idea.likesCount || idea.likes?.length || 0;
  const dislikesCount = idea.dislikesCount || idea.dislikes?.length || 0;
  const isCreator = idea.creatorId === currentUser?.uid;
  const comments = idea.comments || [];
  const categoryColor = getCategoryColor(idea.category);

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 3, color: 'text.secondary' }}>
        Back to Dashboard
      </Button>

      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ '&:hover': { transform: 'none' }, position: 'relative', overflow: 'visible',
          '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '16px 16px 0 0', background: `linear-gradient(90deg, ${categoryColor}, #06B6D4)` } }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                {/* Category */}
                {idea.category && (
                  <Chip
                    label={`${getCategoryIcon(idea.category)} ${getCategoryLabel(idea.category)}`}
                    size="small"
                    sx={{ mb: 2, backgroundColor: `${categoryColor}18`, color: categoryColor, fontWeight: 600, border: `1px solid ${categoryColor}30` }}
                  />
                )}
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>{idea.title}</Typography>
              </Box>
              {isCreator && (
                <Tooltip title="Delete idea">
                  <IconButton onClick={() => setDeleteOpen(true)} sx={{ border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Meta info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{idea.creatorName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{formatDate(idea.createdAt)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{timeAgo(idea.createdAt)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'rgba(148,163,184,0.1)' }} />

            {/* Description */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Description</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{idea.description}</Typography>

            <Divider sx={{ mb: 4, borderColor: 'rgba(148,163,184,0.1)' }} />

            {/* Like / Dislike Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(124,58,237,0.15)', flexWrap: 'wrap' }}>
              <Button variant={hasLiked ? 'contained' : 'outlined'} startIcon={hasLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                onClick={handleLike} disabled={actionLoading}
                sx={hasLiked ? { background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' } : { borderColor: '#7C3AED', color: '#7C3AED' }}>
                {hasLiked ? 'Liked' : 'Like'}
              </Button>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#7C3AED' }}>{likesCount}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{likesCount === 1 ? 'like' : 'likes'}</Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(148,163,184,0.15)', mx: 1 }} />

              <Button variant={hasDisliked ? 'contained' : 'outlined'} startIcon={hasDisliked ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                onClick={handleDislike} disabled={actionLoading}
                sx={hasDisliked ? { background: 'linear-gradient(135deg, #EF4444, #DC2626)', '&:hover': { background: 'linear-gradient(135deg, #F87171, #EF4444)' } } : { borderColor: '#EF4444', color: '#EF4444' }}>
                {hasDisliked ? 'Disliked' : 'Dislike'}
              </Button>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>{dislikesCount}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{dislikesCount === 1 ? 'dislike' : 'dislikes'}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </MotionBox>

      {/* Comments Section */}
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} sx={{ mt: 4 }}>
        <Card sx={{ '&:hover': { transform: 'none' } }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              💬 Comments ({comments.length})
            </Typography>

            {/* Add Comment Form */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', fontSize: '0.8rem', fontWeight: 700, mt: 0.5 }}>
                {getInitials(userProfile?.displayName || 'U')}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<SendIcon />}
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || commentLoading}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    {commentLoading ? 'Posting...' : 'Post'}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: 'rgba(148,163,184,0.1)' }} />

            {/* Comments List */}
            {comments.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {comments.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(30, 41, 59, 0.3)',
                      border: '1px solid rgba(148,163,184,0.06)',
                      transition: 'all 0.2s ease',
                      '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.5)' }
                    }}
                  >
                    <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {getInitials(comment.userName)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {comment.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {timeAgo(comment.createdAt)}
                          </Typography>
                        </Box>
                        {comment.userId === currentUser?.uid && (
                          <Tooltip title="Delete comment">
                            <IconButton size="small" onClick={() => handleDeleteComment(comment)}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' }, p: 0.5 }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No comments yet. Be the first to share your thoughts!</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </MotionBox>

      <ConfirmDialog open={deleteOpen} title="Delete Idea" message="Are you sure you want to delete this idea? This action cannot be undone."
        confirmLabel="Delete" severity="error" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
};

export default IdeaDetailsPage;
