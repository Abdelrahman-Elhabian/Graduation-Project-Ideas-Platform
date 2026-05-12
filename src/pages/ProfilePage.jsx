/**
 * Profile Page
 * Displays user profile info and team membership with option to leave team
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { leaveTeam } from '../services/teamService';
import { formatDate, getInitials } from '../utils/helpers';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Box, Card, CardContent, Typography, Avatar, Grid, Chip, Button, Divider
} from '@mui/material';
import {
  Email as EmailIcon, CalendarToday as CalendarIcon,
  Group as GroupIcon, ExitToApp as LeaveIcon, Badge as BadgeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const ProfilePage = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [leaveOpen, setLeaveOpen] = useState(false);

  const displayName = userProfile?.displayName || currentUser?.displayName || 'User';
  const email = currentUser?.email || '';

  const handleLeaveTeam = async () => {
    setLeaveOpen(false);
    if (!userProfile?.teamId) return;
    const { error } = await leaveTeam(userProfile.teamId, currentUser.uid);
    if (error) showSnackbar(error, 'error');
    else {
      await refreshProfile();
      showSnackbar('You have left the team.', 'success');
      navigate('/dashboard');
    }
  };

  const infoItems = [
    { icon: <EmailIcon sx={{ fontSize: 20 }} />, label: 'Email', value: email },
    { icon: <BadgeIcon sx={{ fontSize: 20 }} />, label: 'User ID', value: currentUser?.uid?.slice(0, 12) + '...' },
    { icon: <CalendarIcon sx={{ fontSize: 20 }} />, label: 'Joined', value: formatDate(userProfile?.createdAt) },
    { icon: <GroupIcon sx={{ fontSize: 20 }} />, label: 'Team', value: userProfile?.teamId || 'No team' }
  ];

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Manage your account and team membership" />
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        {/* Profile Card */}
        <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          sx={{ mb: 3, '&:hover': { transform: 'none' } }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', fontSize: '2rem', fontWeight: 800 }}>
                {getInitials(displayName)}
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{displayName}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{email}</Typography>
                {userProfile?.teamId && (
                  <Chip label={`Team: ${userProfile.teamId}`} size="small" sx={{ mt: 1, backgroundColor: 'rgba(124,58,237,0.12)', color: '#A78BFA', fontWeight: 600 }} />
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: 'rgba(148,163,184,0.1)' }} />

            <Grid container spacing={2.5}>
              {infoItems.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(30,41,59,0.5)' }}>
                    <Box sx={{ color: '#7C3AED' }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{item.value}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </MotionCard>

        {/* Leave Team Card */}
        {userProfile?.teamId && (
          <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            sx={{ '&:hover': { transform: 'none' }, border: '1px solid rgba(239,68,68,0.2)' }}>
            <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#EF4444', mb: 0.5 }}>Leave Team</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Leave your current team. You can join another team afterwards.</Typography>
              </Box>
              <Button variant="outlined" startIcon={<LeaveIcon />} onClick={() => setLeaveOpen(true)}
                sx={{ borderColor: '#EF4444', color: '#EF4444', '&:hover': { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' } }}>
                Leave Team
              </Button>
            </CardContent>
          </MotionCard>
        )}
      </Box>

      <ConfirmDialog open={leaveOpen} title="Leave Team" message="Are you sure you want to leave this team? You will lose access to all team ideas."
        confirmLabel="Leave" severity="warning" onConfirm={handleLeaveTeam} onCancel={() => setLeaveOpen(false)} />
    </Box>
  );
};

export default ProfilePage;
