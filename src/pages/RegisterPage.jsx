/**
 * Register Page
 */
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { registerUser } from '../services/authService';
import { isValidEmail } from '../utils/helpers';
import {
  Box, Container, Typography, TextField, Button, Link,
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon, Person as PersonIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  LightbulbCircle as LogoIcon, ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });
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
    if (!formData.displayName.trim()) errs.displayName = 'Name is required';
    else if (formData.displayName.trim().length < 2) errs.displayName = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await registerUser(formData.email, formData.password, formData.displayName.trim());
    setLoading(false);
    if (error) {
      if (error.includes('email-already-in-use')) showSnackbar('Email already in use.', 'error');
      else showSnackbar(error, 'error');
    } else {
      showSnackbar('Account created successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F1A', position: 'relative', overflow: 'hidden', py: 4 }}>
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', top: -100, left: -100, filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', bottom: -80, right: -80, filter: 'blur(60px)' }} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3, color: 'text.secondary' }}>Back to Home</Button>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(30,41,59,0.7) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LogoIcon sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Create Account</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Join GradIdeas and start collaborating</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField fullWidth id="register-name" name="displayName" label="Full Name" value={formData.displayName} onChange={handleChange} error={!!errors.displayName} helperText={errors.displayName} sx={{ mb: 2.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <TextField fullWidth id="register-email" name="email" label="Email Address" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 2.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <TextField fullWidth id="register-password" name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} sx={{ mb: 2.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> } }} />
            <TextField fullWidth id="register-confirm-password" name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={{ mb: 3.5 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 3 }}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Sign in</Link>
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default RegisterPage;
