/**
 * EmptyState Component
 * Displays a friendly empty state with an icon, message, and optional action
 */

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
          mb: 3
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          size="large"
          sx={{ px: 4 }}
        >
          {actionLabel}
        </Button>
      )}
    </MotionBox>
  );
};

export default EmptyState;
