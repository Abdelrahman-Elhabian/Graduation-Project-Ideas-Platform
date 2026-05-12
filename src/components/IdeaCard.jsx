/**
 * IdeaCard Component
 * Displays a project idea in a styled card with like & dislike functionality
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { toggleLikeIdea, toggleDislikeIdea } from '../services/ideaService';
import { formatDate } from '../utils/helpers';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDown as ThumbDownIcon,
  ThumbDownOffAlt as ThumbDownOffAltIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const IdeaCard = ({ idea, onLikeUpdate }) => {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);

  const hasLiked = idea.likes?.includes(currentUser?.uid);
  const hasDisliked = idea.dislikes?.includes(currentUser?.uid);
  const likesCount = idea.likesCount || idea.likes?.length || 0;
  const dislikesCount = idea.dislikesCount || idea.dislikes?.length || 0;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (actionLoading) return;
    setActionLoading(true);
    const { error } = await toggleLikeIdea(idea.id, currentUser.uid);
    if (error) showSnackbar(error, 'error');
    else if (onLikeUpdate) onLikeUpdate();
    setActionLoading(false);
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (actionLoading) return;
    setActionLoading(true);
    const { error } = await toggleDislikeIdea(idea.id, currentUser.uid);
    if (error) showSnackbar(error, 'error');
    else if (onLikeUpdate) onLikeUpdate();
    setActionLoading(false);
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: '16px 16px 0 0',
          background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
          opacity: 0.8
        }
      }}
      onClick={() => navigate(`/dashboard/idea/${idea.id}`)}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {idea.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.secondary',
            lineHeight: 1.6
          }}
        >
          {idea.description}
        </Typography>

        {/* Like / Dislike Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Like */}
          <Tooltip title={hasLiked ? 'Remove like' : 'Like'}>
            <IconButton
              onClick={handleLike}
              disabled={actionLoading}
              size="small"
              sx={{
                color: hasLiked ? '#7C3AED' : 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#7C3AED', transform: 'scale(1.15)' }
              }}
            >
              {hasLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ color: hasLiked ? '#7C3AED' : 'text.secondary', fontWeight: 600, minWidth: 16 }}>
            {likesCount}
          </Typography>

          {/* Dislike */}
          <Tooltip title={hasDisliked ? 'Remove dislike' : 'Dislike'}>
            <IconButton
              onClick={handleDislike}
              disabled={actionLoading}
              size="small"
              sx={{
                color: hasDisliked ? '#EF4444' : 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#EF4444', transform: 'scale(1.15)' }
              }}
            >
              {hasDisliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOffAltIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ color: hasDisliked ? '#EF4444' : 'text.secondary', fontWeight: 600, minWidth: 16 }}>
            {dislikesCount}
          </Typography>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 0,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Creator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {idea.creatorName}
          </Typography>
        </Box>

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {formatDate(idea.createdAt)}
          </Typography>
        </Box>
      </CardActions>
    </MotionCard>
  );
};

export default IdeaCard;
