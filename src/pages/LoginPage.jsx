/**
 * Login Page
 */
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { loginUser } from '../services/authService';
import { isValidEmail } from '../utils/helpers';
import {
  Box, Container, Typography, TextField, Button, Link,
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  LightbulbCircle as LogoIcon, ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const LoginPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await loginUser(formData.email, formData.password);
    setLoading(false);
    if (error) { showSnackbar('Invalid email or password.', 'error'); }
    else { showSnackbar('Welcome back!', 'success'); navigate('/dashboard'); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F1A', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', top: -100, right: -100, filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', bottom: -80, left: -80, filter: 'blur(60px)' }} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3, color: 'text.secondary' }}>Back to Home</Button>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(30,41,59,0.7) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LogoIcon sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Welcome Back</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Sign in to continue to GradIdeas</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField fullWidth id="login-email" name="email" label="Email Address" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 2.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <TextField fullWidth id="login-password" name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} sx={{ mb: 3.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> } }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 3 }}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Create one</Link>
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default LoginPage;
