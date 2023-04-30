import React from 'react';
import { Box, Typography, Grid, IconButton, SvgIcon, useTheme, styled } from '@mui/material';
import { ReactComponent as Logo } from '../Footer/logo.svg'; // Import your logo SVG file
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const StyledLogo = styled(Logo)(({ theme }) => ({
  filter: `drop-shadow(0 0 3px ${theme.palette.primary.contrastText})`,
}));

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 4,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item>
          <StyledLogo width="120" height="120" fill={theme.palette.primary.contrastText} />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            The Ultimate Web3 Event Ticketing System
          </Typography>
          <Typography variant="body1" align="center" sx={{ letterSpacing: 1 }}>
            &copy; 2023 All Rights Reserved
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <IconButton
              color="inherit"
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              edge="end"
              size="large"
              sx={{ '&:hover': { transform: 'scale(1.2)' } }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              edge="end"
              size="large"
              sx={{ '&:hover': { transform: 'scale(1.2)' } }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              sx={{ '&:hover': { transform: 'scale(1.2)' } }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
