/**
 * Team Dashboard Page
 * Shows team info, members, ideas with search, category filter, and sort
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getTeam } from '../services/teamService';
import { getTeamIdeas } from '../services/ideaService';
import { getInitials, CATEGORIES } from '../utils/helpers';
import PageHeader from '../components/PageHeader';
import IdeaCard from '../components/IdeaCard';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import {
  Box, Grid, Typography, Button, Chip, TextField, MenuItem, Select,
  FormControl, InputLabel, InputAdornment, Card, CardContent, Avatar,
  Tooltip, IconButton
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Group as GroupIcon,
  ContentCopy as CopyIcon, Lightbulb as IdeaIcon,
  ThumbUp as ThumbUpIcon, GroupAdd as GroupAddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const TeamDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const teamId = userProfile?.teamId;

  const fetchData = useCallback(async () => {
    if (!teamId) { setLoading(false); return; }
    setLoading(true);
    const [teamRes, ideasRes] = await Promise.all([
      getTeam(teamId), getTeamIdeas(teamId)
    ]);
    if (teamRes.team) setTeam(teamRes.team);
    if (ideasRes.ideas) setIdeas(ideasRes.ideas);
    if (ideasRes.error) console.error('Ideas fetch error:', ideasRes.error);
    setLoading(false);
  }, [teamId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyTeamId = () => {
    navigator.clipboard.writeText(teamId);
    showSnackbar('Team ID copied to clipboard!', 'success');
  };

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesSearch = !searchQuery || idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) || idea.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || idea.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });

  if (loading) return <LoadingScreen message="Loading dashboard..." />;

  // No team state
  if (!teamId) {
    return (
      <Box>
        <PageHeader title="Dashboard" subtitle="Get started by creating or joining a team" />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: 'rgba(124,58,237,0.5)' } }} onClick={() => navigate('/dashboard/create-team')}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))', mx: 'auto', mb: 3 }}>
                    <GroupAddIcon sx={{ fontSize: 36, color: '#7C3AED' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Create a Team</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Start a new team and invite your classmates to join</Typography>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: 'rgba(6,182,212,0.5)' } }} onClick={() => navigate('/dashboard/join-team')}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))', mx: 'auto', mb: 3 }}>
                    <GroupIcon sx={{ fontSize: 36, color: '#06B6D4' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Join a Team</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Enter a Team ID to join an existing team</Typography>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={team?.name || 'Team Dashboard'}
        subtitle={`Team ID: ${teamId}`}
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Tooltip title="Copy Team ID">
              <IconButton onClick={copyTeamId} sx={{ border: '1px solid rgba(148,163,184,0.15)', borderRadius: 2 }}>
                <CopyIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/add-idea')}>
              New Idea
            </Button>
          </Box>
        }
      />

      {/* Team Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Members', value: team?.members?.length || 0, icon: <GroupIcon />, color: '#7C3AED' },
          { label: 'Ideas', value: ideas.length, icon: <IdeaIcon />, color: '#06B6D4' },
          { label: 'Total Votes', value: ideas.reduce((acc, i) => acc + (i.likesCount || 0), 0), icon: <ThumbUpIcon />, color: '#10B981' }
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card sx={{ '&:hover': { transform: 'none' } }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Members */}
      <Card sx={{ mb: 4, '&:hover': { transform: 'none' } }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Team Members</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {team?.members?.map((member) => (
              <Chip key={member.uid} avatar={<Avatar sx={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', width: 28, height: 28, fontSize: '0.7rem' }}>{getInitials(member.displayName)}</Avatar>}
                label={member.displayName} variant="outlined"
                sx={{ borderColor: member.role === 'owner' ? '#7C3AED' : 'rgba(148,163,184,0.2)', '& .MuiChip-label': { fontWeight: member.role === 'owner' ? 600 : 400 } }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Search, Category & Sort */}
      <Card sx={{ mb: 4, '&:hover': { transform: 'none' } }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField fullWidth size="small" placeholder="Search ideas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Category">
                  <MenuItem value="">All Categories</MenuItem>
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>{cat.icon} {cat.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort</InputLabel>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort">
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="likes">Most Liked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <Grid container spacing={3}>
          {filteredIdeas.map((idea) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idea.id}>
              <IdeaCard idea={idea} onLikeUpdate={fetchData} />
            </Grid>
          ))}
        </Grid>
      ) : ideas.length > 0 ? (
        <EmptyState icon={<SearchIcon sx={{ fontSize: 48, color: '#7C3AED' }} />} title="No matching ideas" description="Try adjusting your search or filters" />
      ) : (
        <EmptyState icon={<IdeaIcon sx={{ fontSize: 48, color: '#7C3AED' }} />} title="No ideas yet" description="Be the first to share a project idea with your team!" actionLabel="Add First Idea" onAction={() => navigate('/dashboard/add-idea')} />
      )}
    </Box>
  );
};

export default TeamDashboard;
