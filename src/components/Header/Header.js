import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';
import './Header.css';


const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const menuItems = [
    { title: 'Home', link: '/' },
    { title: 'Events', link: '/events' },
    { title: 'Tickets', link: '/tickets' },
    { title: 'Resale', link: '/resale' },
    { title: 'Portal', link: '/portal' },
    { title: 'Event Form', link: '/Form' },
  ];

  const LinkComponent = React.forwardRef((props, ref) => (
    <NavLink ref={ref} {...props} />
  ));
  

  return (
    <>
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <img src={logo} className="App-logo" alt="logo" style={{ objectFit: 'contain' }} />
      </Box>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6">Event Ticketing System</Typography>
          {!isMobile ? (
            <>
              {menuItems.map((item) => (
                <Button
                  color="inherit"
                  key={item.title}
                  component={LinkComponent}
                  to={item.link}
                >
                  {item.title}
                </Button>
              ))}
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      {isMobile ? (
        <Drawer open={drawerOpen} onClose={closeDrawer}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.title}
                onClick={closeDrawer}
                component={LinkComponent}
                to={item.link}
              >
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      ) : null}
    </>
  );
};

export default Header;
