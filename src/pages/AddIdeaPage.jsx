/**
 * Add Idea Page
 * Form to create a new project idea (title, description, category)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { createIdea } from '../services/ideaService';
import { CATEGORIES } from '../utils/helpers';
import PageHeader from '../components/PageHeader';
import {
  Box, Card, CardContent, TextField, Button, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Lightbulb as IdeaIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const AddIdeaPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', description: '', category: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (!formData.category) errs.category = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!userProfile?.teamId) {
      showSnackbar('You need to join a team first!', 'warning');
      return;
    }

    setLoading(true);
    const displayName = userProfile?.displayName || currentUser?.displayName || 'User';
    const ideaData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      creatorId: currentUser.uid,
      creatorName: displayName
    };

    const { error } = await createIdea(userProfile.teamId, ideaData);
    setLoading(false);

    if (error) { showSnackbar(error, 'error'); }
    else {
      showSnackbar('Idea added successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <Box>
      <PageHeader title="Add New Idea" subtitle="Share your project idea with the team" />
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          sx={{ '&:hover': { transform: 'none' } }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.1))', mx: 'auto', mb: 2 }}>
                <IdeaIcon sx={{ fontSize: 36, color: '#F59E0B' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>New Project Idea</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Describe your graduation project concept</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField fullWidth id="idea-title" name="title" label="Project Title" placeholder="e.g. AI-Powered Student Advisor" value={formData.title} onChange={handleChange} error={!!errors.title} helperText={errors.title} sx={{ mb: 2.5 }} />

              <FormControl fullWidth error={!!errors.category} sx={{ mb: 2.5 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="idea-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '1.1rem' }}>{cat.icon}</Typography>
                        <Typography>{cat.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}>{errors.category}</Typography>
                )}
              </FormControl>

              <TextField fullWidth id="idea-description" name="description" label="Description" placeholder="Describe your project idea, its goals, features, and impact..." value={formData.description} onChange={handleChange} error={!!errors.description} helperText={errors.description} multiline rows={6} sx={{ mb: 3.5 }} />

              <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, borderRadius: 2.5 }}>
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Idea'}
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </Box>
    </Box>
  );
};

export default AddIdeaPage;
