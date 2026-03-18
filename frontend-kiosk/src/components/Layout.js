import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Switch,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as TransferIcon,
  Home as LoanIcon,
  CreditCard as CardIcon,
  Receipt as StatementIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout,
  Language,
  Accessibility,
  DarkMode,
  LightMode,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import '../styles/DashboardLayout.css';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
  { text: 'Transfers', icon: <TransferIcon />, id: 'transfer' },
  { text: 'Loans', icon: <LoanIcon />, id: 'loan' },
  { text: 'Cards', icon: <CardIcon />, id: 'card' },
  { text: 'Statements', icon: <StatementIcon />, id: 'statement' },
  { text: 'Settings', icon: <SettingsIcon />, id: 'settings' },
];

// Animation variants
const sidebarVariants = {
  hidden: {
    x: -280,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

function Layout({
  children,
  currentService,
  setCurrentService,
  userRole,
  email,
  onLogout,
  showAccessibility,
  setShowAccessibility,
  language,
  setLanguage,
  t,
  darkMode,
  setDarkMode,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (id) => {
    if (id === 'settings') {
      setShowAccessibility(true);
    } else if (id === 'dashboard') {
      setCurrentService(null);
    } else {
      setCurrentService(id);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
        }}>
          <Avatar
            sx={{
              bgcolor: 'white',
              width: 52,
              height: 52,
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            🏦
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                letterSpacing: '-0.5px',
              }}
            >
              Bank AI
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
              }}
            >
              Self-Service Kiosk
            </Typography>
          </Box>
        </Box>
      </motion.div>
      
      <Divider />
      
      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            custom={index}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                selected={currentService === item.id || (item.id === 'dashboard' && currentService === null)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(30, 58, 95, 0.4)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
      
      <Divider />
      
      {/* Bottom Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t.welcome}
        </Typography>
        
        {/* Theme Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {darkMode ? <DarkMode sx={{ color: 'primary.main' }} /> : <LightMode sx={{ color: 'warning.main' }} />}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </Box>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {currentService
                ? menuItems.find((item) => item.id === currentService)?.text || 'Service'
                : t.title}
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          {/* Language Selector */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              sx={{ mr: 1 }}
            >
              <Language />
            </IconButton>
          </motion.div>

          {/* Accessibility */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              onClick={() => setShowAccessibility(true)}
              sx={{ mr: 1 }}
            >
              <Accessibility />
            </IconButton>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ mr: 2 }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </motion.div>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  fontSize: '0.9rem',
                }}
              >
                {email ? email[0].toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </motion.div>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 2,
              }
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userRole === 'admin' ? 'Administrator' : 'Customer'}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
            },
          }}
          open
        >
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sidebarVariants}
            >
              {drawer}
            </motion.div>
          </AnimatePresence>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService || 'dashboard'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default Layout;

