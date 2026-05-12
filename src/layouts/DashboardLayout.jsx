/**
 * Dashboard Layout
 * Main layout with collapsible sidebar navigation and top bar
 * Desktop: toggle between full sidebar and mini (icons-only) mode
 * Mobile: slide-out drawer
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { logoutUser } from '../services/authService';
import { getInitials } from '../utils/helpers';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  GroupAdd as GroupAddIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  LightbulbCircle as LogoIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

const DashboardLayout = () => {
  const { currentUser, userProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Create Team', icon: <GroupAddIcon />, path: '/dashboard/create-team' },
    { text: 'Join Team', icon: <PersonAddIcon />, path: '/dashboard/join-team' },
    { text: 'Add Idea', icon: <AddIcon />, path: '/dashboard/add-idea' },
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' }
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopToggle = () => setDesktopOpen(!desktopOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    const { error } = await logoutUser();
    if (error) {
      showSnackbar(error, 'error');
    } else {
      showSnackbar('Logged out successfully', 'success');
      navigate('/');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const displayName = userProfile?.displayName || currentUser?.displayName || 'User';

  // Current drawer width based on state
  const currentDrawerWidth = desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH;

  // Full sidebar content (for mobile and desktop expanded)
  const drawerContent = (expanded) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: expanded ? 2.5 : 1.5,
          pb: expanded ? 2 : 1.5,
          cursor: 'pointer',
          justifyContent: expanded ? 'flex-start' : 'center',
          minHeight: 64
        }}
        onClick={() => handleNavigation('/dashboard')}
      >
        <LogoIcon sx={{ fontSize: expanded ? 36 : 30, color: '#7C3AED' }} />
        {expanded && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem',
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
              }}
            >
              GradIdeas
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              Project Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(148,163,184,0.08)' }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: expanded ? 1.5 : 0.8, py: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={expanded ? '' : item.text} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: expanded ? 2 : 0,
                    justifyContent: expanded ? 'flex-start' : 'center',
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                    borderLeft: expanded ? (isActive ? '3px solid #7C3AED' : '3px solid transparent') : 'none',
                    '&:hover': {
                      backgroundColor: isActive
                        ? 'rgba(124, 58, 237, 0.18)'
                        : 'rgba(148, 163, 184, 0.06)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#7C3AED' : 'text.secondary',
                      minWidth: expanded ? 40 : 0,
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {expanded && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#F1F5F9' : 'text.secondary',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(148,163,184,0.08)' }} />

      {/* Toggle Button (desktop only, shown inside sidebar) */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: expanded ? 'flex-end' : 'center', px: 1.5, py: 1 }}>
          <Tooltip title={expanded ? 'Collapse sidebar' : 'Expand sidebar'} placement="right" arrow>
            <IconButton
              onClick={handleDesktopToggle}
              size="small"
              sx={{
                color: 'text.secondary',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 1.5,
                width: 32,
                height: 32,
                '&:hover': { color: '#7C3AED', borderColor: 'rgba(124,58,237,0.3)', backgroundColor: 'rgba(124,58,237,0.06)' },
                transition: 'all 0.2s ease'
              }}
            >
              {expanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Close button for mobile */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, py: 1 }}>
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'text.secondary' }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* User Info */}
      <Box sx={{ p: expanded ? 2 : 1 }}>
        {expanded ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(30, 41, 59, 0.5)'
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              {getInitials(displayName)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  fontSize: '0.7rem'
                }}
              >
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Tooltip title={displayName} placement="right" arrow>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {getInitials(displayName)}
              </Avatar>
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* AppBar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <LogoIcon sx={{ fontSize: 28, color: '#7C3AED', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
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
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {getInitials(displayName)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH
          }
        }}
      >
        {drawerContent(true)}
      </Drawer>

      {/* Desktop drawer — collapsible */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: currentDrawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden'
          }
        }}
        open
      >
        {drawerContent(desktopOpen)}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Spacer for mobile AppBar */}
        <Toolbar sx={{ display: { md: 'none' } }} />

        {/* Top Bar for desktop */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 4,
            py: 2,
            borderBottom: '1px solid rgba(148, 163, 184, 0.06)'
          }}
        >
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                {getInitials(displayName)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              background: 'linear-gradient(135deg, #111827, #1E293B)',
              border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: 2
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/profile'); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.1)' }} />
          <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#EF4444' }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
