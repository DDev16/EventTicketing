import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';

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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6">
            Event Ticketing System
          </Typography>
          {!isMobile ? (
            <>
              {menuItems.map(item => (
                <Button color="inherit" key={item.title} component={NavLink} to={item.link} activeClassName="active">
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
            {menuItems.map(item => (
              <ListItem button key={item.title} onClick={closeDrawer} component={NavLink} to={item.link} activeClassName="active">
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