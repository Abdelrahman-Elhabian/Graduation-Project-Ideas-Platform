/**
 * Idea Details Page
 * Full view of a single idea with all info and like functionality
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getIdea, toggleLikeIdea, toggleDislikeIdea, deleteIdea } from '../services/ideaService';
import { formatDate, timeAgo } from '../utils/helpers';
import LoadingScreen from '../components/LoadingScreen';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Box, Card, CardContent, Typography, Button, Divider, IconButton, Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon, ThumbUp as ThumbUpIcon, ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDown as ThumbDownIcon, ThumbDownOffAlt as ThumbDownOffAltIcon,
  Delete as DeleteIcon, Person as PersonIcon, CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const IdeaDetailsPage = () => {
  const { ideaId } = useParams();
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchIdea = async () => {
    setLoading(true);
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

  if (loading) return <LoadingScreen message="Loading idea..." />;
  if (!idea) return null;

  const hasLiked = idea.likes?.includes(currentUser?.uid);
  const hasDisliked = idea.dislikes?.includes(currentUser?.uid);
  const likesCount = idea.likesCount || idea.likes?.length || 0;
  const dislikesCount = idea.dislikesCount || idea.dislikes?.length || 0;
  const isCreator = idea.creatorId === currentUser?.uid;

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 3, color: 'text.secondary' }}>
        Back to Dashboard
      </Button>

      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ '&:hover': { transform: 'none' }, position: 'relative', overflow: 'visible', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '16px 16px 0 0', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' } }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2, flex: 1 }}>{idea.title}</Typography>
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

      <ConfirmDialog open={deleteOpen} title="Delete Idea" message="Are you sure you want to delete this idea? This action cannot be undone."
        confirmLabel="Delete" severity="error" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
};

export default IdeaDetailsPage;
