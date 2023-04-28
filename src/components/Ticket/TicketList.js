import { useState, useEffect } from 'react';
import { web3, contract } from '../web3.js';
import './TicketList.css';
import ticketImage from './ef.jpg';


// TicketResaleList is a React component that displays a list of resale tickets.
function TicketResaleList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');


  function handleSearchInput(event) {
    setSearch(event.target.value);
  }
  
  // Fetch resale tickets once the component mounts.
  useEffect(() => {
    fetchTickets();
  }, []);

  // Request user account access and fetch resale tickets.
  async function fetchTickets() {
    try {
      await web3.eth.getAccounts();
      const ticketData = await getTicketsForResale();
      setTickets(ticketData);
    } catch (error) {
      console.error('Error fetching resale tickets:', error);
    }
  }

  // Retrieve resale tickets from the smart contract.
  async function getTicketsForResale() {
    const totalTickets = await contract.methods.getTotalTickets().call();
    const resaleTickets = [];
  
    for (let i = 1; i <= totalTickets; i++) {
      const ticket = await contract.methods.getTicketDetails(i).call();
  
      if (ticket.isAvailableForResale) {
        const ticketOwner = await contract.methods.ownerOf(i).call();
        const ticketPrice = await contract.methods.getResaleTicketPrice(i).call();
  
        // Make an additional API call to retrieve the event name based on the eventId
        const eventName = await getEventName(ticket.eventId);
  
        resaleTickets.push({
          ticketId: i,
          eventId: ticket.eventId,
          eventName: eventName,
          price: ticketPrice,
          owner: ticketOwner,
        });
      }
    }
  
    return resaleTickets;
  }
  
  // Function to retrieve the event name based on the eventId
  async function getEventName(eventId) {
    const event = await contract.methods.getEvent(eventId).call();
    return event.name;
  }
  async function buyResaleTicket(ticketId, price) {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.buyResaleTicket(ticketId).send({ from: accounts[0], value: price });
      alert('Ticket purchase successful!');

      // Fetch the updated ticket list
      fetchTickets();
    } catch (error) {
      console.error('Error buying resale ticket:', error);
      alert('Ticket purchase failed. Please try again.');
    }
  }

  function handleSearchInput(event) {
    setSearch(event.target.value);
  }

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by event ID"
          value={search}
          onChange={handleSearchInput}
        />
      </div>
      <div className="image-container">
        {tickets
          .filter((ticket) => ticket.eventId.includes(search))
          .map((ticket) => (
          <div key={ticket.ticketId} className="ticket">
            <div className="ticket-image">
              <img src={ticket.imageUrl ? ticket.imageUrl : ticketImage} alt="Ticket" />
            </div>
    
            <div className="ticket-info">
  <h3>Ticket ID: {ticket.ticketId}</h3>
  <p>Event ID: {ticket.eventId}</p>
  <p>Event Name: {ticket.eventName}</p>
  <p>Price: ${ticket.price}</p>
  <p>Owner: {ticket.owner}</p>
  <button className="buy-ticket-button" onClick={() => buyResaleTicket(ticket.ticketId, ticket.price)}>
    Buy Ticket
  </button>
</div>
          
        </div>
      ))}
    </div>
    </div>
  );
}

export default TicketResaleList;