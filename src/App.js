import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from './components/Event/EventList';
import ResaleForm from './components/Ticket/TicketResale';
import TicketList from './components/Ticket/TicketList';
import './App.css';
import Portal from './components/Portal/Portal';
import { Container, Typography, Box, Divider } from '@mui/material';
import Header from './components/Header/Header.js'
import EventForm from './components/Event/EventForm';



const App = () => {
  return (
    <Router>
      <Container maxWidth="md">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Typography variant="h4" align="center" gutterBottom>
                The Ultimate
              </Typography>
              <Typography variant="h2" align="center" gutterBottom>
                Web3 Event Ticketing System
                </Typography>
                <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
  <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Welcome to Our Smart Event Ticketing Platform!</Typography>
  <Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
    Are you tired of dealing with fraud and counterfeit tickets at your events? Our platform is here to revolutionize the event management industry. Powered by cutting-edge blockchain technology, our platform is designed to make event ticketing secure, transparent, and user-friendly.
  </Typography>
  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: 'black' }}>Key Use Cases</Typography>
<Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
Fraud Prevention, Resale Control, Event Management, and Real-time Ticket Availability. Our platform leverages the security of blockchain and smart contracts to prevent ticket fraud and counterfeiting, control ticket resale, and provide real-time ticket availability, ensuring a smooth user experience.
</Typography>

<Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: 'black' }}>Why Choose Our Platform?</Typography>
<Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
Security, Professionalism, Innovative Features, and Cost-effectiveness. Our platform is built on the Ethereum blockchain, ensuring the highest level of security and transparency for all transactions. Our team is dedicated to providing a seamless, professional experience for event organizers and attendees alike. Our platform offers unique features such as controlled ticket resale, real-time ticket availability, and event management tools, setting us apart from traditional ticketing platforms. By leveraging blockchain technology, we're able to reduce operational costs and offer competitive pricing for event organizers and ticket buyers.
</Typography>

<Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: 'black' }}>Join Us Now and Experience the Future of Event Ticketing!</Typography>
<Typography paragraph sx={{ fontWeight: 'medium', fontSize: '1.2rem', textAlign: 'justify', lineHeight: 1.6 }}>
Say goodbye to ticket fraud and hello to secure, transparent, and user-friendly event management. Disclaimer: This website does not constitute financial advice or any other kind of advice. Use of the platform is at your own risk, and you should always conduct your own research and due diligence before making any decisions.
</Typography>

</div>

            </>
          } />
          <Route path="/events" element={
            <>
              <Box my={4}><Divider /></Box>
              <Typography variant="h4" align="center" gutterBottom>
                
              </Typography>
              <EventList />
            </>
          } />
          <Route path="/tickets" element={
            <>
              <Box my={4}><Divider /></Box>
              <Typography variant="h4" align="center" gutterBottom>
                Tickets
              </Typography>
              <TicketList />
            </>
          } />
          <Route path="/resale" element={
            <>
              <Box my={4}><Divider /></Box>
              <Typography variant="h4" align="center" gutterBottom>
                Resale
              </Typography>
              <ResaleForm />
            </>
          } />
          <Route path="/portal" element={
            <>
              <Box my={4}><Divider /></Box>
              <Typography variant="h4" align="center" gutterBottom>
                Portal
              </Typography>
              <Portal />
            </>
          } /><Route path="/Form" element={
            <>
              <Box my={4}><Divider /></Box>
              <Typography variant="h4" align="center" gutterBottom>
                Event Form
              </Typography>
              <EventForm />
            </>
          } />
        </Routes>
        
      </Container>
    </Router>
  );
}

export default App;