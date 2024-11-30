import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText'; 
import MailIcon from '@mui/icons-material/Mail';
import UserIcon from '@mui/icons-material/Person';
import GarageIcon from '@mui/icons-material/Garage';
import AboutIcon from '@mui/icons-material/Info';
import TrashIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import SpamIcon from '@mui/icons-material/Report';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';

// 'All mail', 'Trash', 'Spam'
const drawerWidth = 240;

const menuItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'My Garage', path: '/garage', icon: <GarageIcon /> },
  { text: 'Profile', path: '/user', icon: <UserIcon /> },
  { text: 'About', path: '/about', icon: <AboutIcon /> },
  { text: 'Inbox', path: '/home', icon: <MailIcon /> },
  { text: 'Trash', path: '/home', icon: <TrashIcon /> },
  { text: 'Spam', path: '/home', icon: <SpamIcon /> },
]
const getIconForItem = (item) => {
  switch (item) {
    case 'Home':
      return <HomeIcon />;
    case 'My Garage':
      return <GarageIcon />;
    case 'Profile':
      return <UserIcon />;
    case 'About':
      return <AboutIcon />;
    case 'Inbox':
      return <MailIcon />;
    case 'Trash':
      return <TrashIcon />;
    case 'Spam':
      return <SpamIcon />;
    default:
      return <HomeIcon />;  // Default fallback icon
  }
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// APP BAR 
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function SideBarDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CarJourney
          </Typography>
          
          {/* SEARCH BAR ICON */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="..."
            sx={{ backgroundColor: 'white',
               borderRadius: 1,
               ml: open ? 8 : 8,
               width: 300,
             }} // Styling to make it stand out
          />


            {/* NAVIGATION BAR ICONS */}
          <IconButton color="inherit" sx={{ marginLeft: 'auto', mr: 1 }} href="/home">
            <HomeIcon />  {/* Home Button */}
          </IconButton>
          <IconButton color="inherit" sx={{ mr: 1 }} href="/home">
            <LoginIcon />  {/* Login Button */}
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />  {/* Notifications Button */}
          </IconButton>


        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.slice(0, 4).map((menuItem, index) => ( // Home, My Garage, Profile, About
            <ListItem key={menuItem.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={menuItem.path}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open ? { mr: 3 } : { mr: 'auto' },
                  ]}
                >
                  {menuItem.icon}
                </ListItemIcon>
                <ListItemText
                  primary={menuItem.text}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Inbox', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    mr: open ? 3 : 'auto',
                  }}
                >
                  {getIconForItem(text)}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* has sidebar as the parent route element, with child elements (profile, car garage, etc)*/}
        <Outlet />
      </Box>
    </Box>
  );
}
