/**
 * 404 Not Found Page
 */
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home as HomeIcon, SentimentDissatisfied as SadIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F1A', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(80px)' }} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center' }}>
          <SadIcon sx={{ fontSize: 80, color: '#7C3AED', mb: 2, opacity: 0.7 }} />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '5rem', md: '8rem' }, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Page Not Found</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Typography>
          <Button variant="contained" size="large" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ px: 4, py: 1.5, borderRadius: 3 }}>
            Go Home
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
