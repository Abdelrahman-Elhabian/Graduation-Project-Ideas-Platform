/**
 * Home Page
 * Landing page with hero section, features, and call-to-action
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  LightbulbCircle as LogoIcon,
  GroupWork as TeamIcon,
  Lightbulb as IdeaIcon,
  ThumbUp as VoteIcon,
  Search as SearchIcon,
  Shield as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const features = [
  {
    icon: <TeamIcon sx={{ fontSize: 40 }} />,
    title: 'Team Collaboration',
    description: 'Create or join teams with a unique Team ID. Work together on brainstorming the perfect project.',
    color: '#7C3AED'
  },
  {
    icon: <IdeaIcon sx={{ fontSize: 40 }} />,
    title: 'Share Ideas',
    description: 'Post project ideas with detailed descriptions, technologies, and difficulty levels.',
    color: '#06B6D4'
  },
  {
    icon: <VoteIcon sx={{ fontSize: 40 }} />,
    title: 'Vote & Rank',
    description: 'Like the best ideas and sort by popularity. Let the team decide democratically.',
    color: '#10B981'
  },
  {
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    title: 'Search & Filter',
    description: 'Find ideas quickly by title, technology stack, or difficulty level.',
    color: '#F59E0B'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Access',
    description: 'Team data is private and secure. Only members can view and interact with team content.',
    color: '#EF4444'
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Fast & Modern',
    description: 'Built with React and Firebase for lightning-fast performance and real-time updates.',
    color: '#8B5CF6'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B0F1A' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <LogoIcon sx={{ fontSize: 32, color: '#7C3AED', mr: 1.5 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                flex: 1
              }}
            >
              GradIdeas
            </Typography>
            {currentUser ? (
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                endIcon={<ArrowIcon />}
              >
                Dashboard
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowIcon />}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            top: -100,
            left: -100,
            filter: 'blur(60px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            bottom: -50,
            right: -50,
            filter: 'blur(60px)'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 0.8,
                borderRadius: 10,
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                mb: 4
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#A78BFA', fontWeight: 600, letterSpacing: 0.5 }}>
                Built for University Students
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 3,
                background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 40%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Your Graduation Project
              <br />
              Starts with an Idea
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.15rem' }
              }}
            >
              Create teams, brainstorm ideas, vote on the best concepts, and turn your
              graduation project into something extraordinary.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(124, 58, 237, 0.5)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Start for Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3
                }}
              >
                Sign In
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', mb: 8 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #F1F5F9, #94A3B8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Everything You Need
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto' }}>
              A complete platform designed to streamline your graduation project planning from start to finish.
            </Typography>
          </MotionBox>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        mb: 3
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.1) 100%)',
              border: '1px solid rgba(124,58,237,0.2)'
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto' }}
            >
              Join hundreds of university students already using GradIdeas to plan their graduation projects.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowIcon />}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.05rem',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(124,58,237,0.45)'
                }
              }}
            >
              Create Your Account
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 5,
          borderTop: '1px solid rgba(148,163,184,0.08)',
          textAlign: 'center'
        }}
      >
        <Container>
          {/* Let's Connect */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                marginRight: '10px'
              }}
            >
              Let&apos;s Connect 
            </Typography>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 400, mx: 'auto' }}>
              Built by Abdelrahman Elhabian — feel free to reach out!
            </Typography> */}
            <Button
              variant="outlined"
              size="small"
              href="https://www.linkedin.com/in/abdelrahmanelhabian"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'rgba(124,58,237,0.4)',
                color: '#A78BFA',
                borderRadius: 3,
                px: 3,
                gap: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#7C3AED',
                  backgroundColor: 'rgba(124,58,237,0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 18, height: 18, fill: 'currentColor' }}
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </Box>
              LinkedIn
            </Button>
          </Box>

          {/* Branding */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <LogoIcon sx={{ fontSize: 20, color: '#7C3AED' }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              GradIdeas
            </Typography>
          </Box> */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} Graduation Project Ideas Platform. Built for students, by students.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
