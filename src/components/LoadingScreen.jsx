/**
 * LoadingScreen Component
 * Full-page loading indicator
 */

import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: 3
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={56}
          thickness={3}
          sx={{
            color: '#7C3AED',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }}
        />
        <CircularProgress
          size={56}
          thickness={3}
          sx={{
            color: '#06B6D4',
            position: 'absolute',
            left: 0,
            opacity: 0.3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }}
          variant="determinate"
          value={75}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {message}
      </Typography>
    </MotionBox>
  );
};

export default LoadingScreen;
