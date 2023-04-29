import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from './components/Event/EventList';
import TicketPurchaseForm from './components/Ticket/TicketPurchase';
import ResaleForm from './components/Ticket/TicketResale';
import TicketList from './components/Ticket/TicketList';
import './App.css';
import logo from './logo.png';
import Portal from './components/Portal/Portal';
import { Container, Typography, Box, Divider } from '@mui/material';

const App = () => {
  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <img src={logo} className="App-logo" alt="logo" style={{ objectFit: 'contain' }} />
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        The Ultimate
      </Typography>
      <Typography variant="h2" align="center" gutterBottom>
        Web3 Event Ticketing System
      </Typography>
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
  <Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
    Welcome to our state-of-the-art Event Ticketing System! This platform is powered by blockchain technology, ensuring a secure and seamless experience for both event organizers and attendees.
  </Typography>
  <Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
    To take part in our innovative Event Ticketing System, follow these steps: Create a Wallet, Browse Events, Purchase Tickets, and Resell Tickets (Optional).
  </Typography>
  <Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
    Our Event Ticketing System offers a secure, transparent, and user-friendly solution for event organizers and attendees alike. Say goodbye to fraudulent tickets and scams, and embrace the future of event ticketing with our cutting-edge platform!
  </Typography>
</div>
      
      <Box my={4}><Divider /></Box>
      <Typography variant="h4" align="center" gutterBottom>
      </Typography>
      <EventList />
      <Box my={4}><Divider /></Box>
      <Typography variant="h4" align="center" gutterBottom>
        Ticket Purchase
      </Typography>
      <TicketPurchaseForm />
      <Box my={4}><Divider /></Box>
      <Typography variant="h4" align="center" gutterBottom>
        Ticket Market
      </Typography>
      <TicketList />
      <Box my={4}><Divider /></Box>
      <Typography variant="h4" align="center" gutterBottom>
        Resale
      </Typography>
      <ResaleForm />
      <Typography variant="h4" align="center" gutterBottom>
        Personal Portal
      </Typography>
      <Portal />
    </Container>
  );
}

export default App;
