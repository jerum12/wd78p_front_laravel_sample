import BookIcon from '@mui/icons-material/Book';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MenuIcon from '@mui/icons-material/Menu';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Button } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Booking from './Booking';
import Home from './Home';
import Products from './Products';
import Services from './Services';
import Vehicles from './Vehicles';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const apiBackendUrl = process.env.REACT_APP_BACK_END_URL;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      //call apiBackend
      //http://127.0.0.1:8000/api/logout
      const response = await axios.post(
        `${apiBackendUrl}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('login_token')}`,
            Accept: 'application/json',
          },
        }
      );
      console.log(response);
      localStorage.removeItem('login_token');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('login_token');

    if (!isAuthenticated) {
      navigate('/');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{
          background:
            ' linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(34,121,9,1) 35%, rgba(0,212,255,1) 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Kodego Booking App
          </Typography>
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding onClick={() => navigate('/dashboard')}>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary={<Button variant="text">Dashboard</Button>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/dashboard/vehicles')}>
            <ListItemButton>
              <ListItemIcon>
                <DirectionsCarIcon style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary={<Button variant="text">Vehicles</Button>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/dashboard/services')}>
            <ListItemButton>
              <ListItemIcon>
                <SupportAgentIcon style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary={<Button variant="text">Services</Button>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/dashboard/products')}>
            <ListItemButton>
              <ListItemIcon>
                <CategoryIcon style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary={<Button variant="text">Products</Button>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/dashboard/booking')}>
            <ListItemButton>
              <ListItemIcon>
                <BookIcon style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary={<Button variant="text">Booking</Button>} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open} style={{ background: '#f1f1f1', height: '100vh' }}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Main>
    </Box>
  );
}
