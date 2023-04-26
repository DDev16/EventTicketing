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
      <h2 className="section-title">Socialure</h2>
      <h1 className="page-title">Web3 Event Ticketing System</h1>
      <EventForm />
      <hr />
      <h2 className="section-title">Events</h2>
      <EventList />
      <hr />
      <h2 className="section-title"></h2>
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