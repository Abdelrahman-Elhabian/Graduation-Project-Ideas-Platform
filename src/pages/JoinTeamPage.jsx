/**
 * Join Team Page
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { joinTeam } from '../services/teamService';
import PageHeader from '../components/PageHeader';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, CircularProgress
} from '@mui/material';
import { PersonAdd as JoinIcon, Tag as TagIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const JoinTeamPage = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId.trim()) { setError('Team ID is required'); return; }
    if (userProfile?.teamId) { showSnackbar('You are already in a team. Leave your current team first.', 'warning'); return; }

    setLoading(true);
    const displayName = userProfile?.displayName || currentUser?.displayName || 'User';
    const { team, error: err } = await joinTeam(teamId.trim(), currentUser.uid, displayName);
    setLoading(false);

    if (err) { showSnackbar(err, 'error'); }
    else {
      await refreshProfile();
      showSnackbar(`Successfully joined team "${team.name}"!`, 'success');
      navigate('/dashboard');
    }
  };

  return (
    <Box>
      <PageHeader title="Join Team" subtitle="Enter a Team ID to join an existing team" />
      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          sx={{ '&:hover': { transform: 'none' } }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(124,58,237,0.1))', mx: 'auto', mb: 2 }}>
                <JoinIcon sx={{ fontSize: 36, color: '#06B6D4' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Join a Team</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ask your team leader for the 6-character Team ID</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField fullWidth id="team-id-input" label="Team ID" placeholder="e.g. ABC123" value={teamId}
                onChange={(e) => { setTeamId(e.target.value.toUpperCase()); setError(''); }}
                error={!!error} helperText={error} sx={{ mb: 3 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><TagIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>, style: { letterSpacing: 4, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' } }, htmlInput: { maxLength: 6 } }} />
              <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, borderRadius: 2.5, background: 'linear-gradient(135deg, #06B6D4, #0891B2)', '&:hover': { background: 'linear-gradient(135deg, #67E8F9, #06B6D4)' } }}>
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Join Team'}
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </Box>
    </Box>
  );
};

export default JoinTeamPage;
