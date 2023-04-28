import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventForm from './components/Event/EventForm.js';
import EventList from './components/Event/EventList.js';
import TicketPurchaseForm from './components/Ticket/TicketPurchase.js';
import ResaleForm from './components/Ticket/TicketResale.js';
import TicketList from './components/Ticket/TicketList.js';
import './App.css';
import logo from './logo.png';

function App() {
  return (
    <div className="container app-container">
      <div className="logo-container">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <h2 className="section-title">The Ultimate</h2>
      <h1 className="page-title">Web3 Event Ticketing System</h1>
      <p>
        Welcome to our state-of-the-art Event Ticketing System! This platform is powered by blockchain technology, ensuring a secure and seamless experience for both event organizers and attendees.
      </p>
      <p>
        To take part in our innovative Event Ticketing System, follow these steps: Create a Wallet, Browse Events, Purchase Tickets, and Resell Tickets (Optional).
      </p>
      <p>
        Our Event Ticketing System offers a secure, transparent, and user-friendly solution for event organizers and attendees alike. Say goodbye to fraudulent tickets and scams, and embrace the future of event ticketing with our cutting-edge platform!
      </p>
      <EventForm />
      <hr />
      <h2 className="section-title">Events</h2>
      <EventList />
      <hr />
      <h2 className="section-title">Ticket Purchase</h2>
      <TicketPurchaseForm />
      <hr />
      <h2 className="section-title">Ticket Market</h2>
      <TicketList />
      <hr />
      <h2 className="section-title">Resale</h2>
      <ResaleForm />
    </div>
  );
}

export default App;
