import { useState, useEffect } from 'react';
import { web3, contract } from '../web3.js';

function TicketResaleList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      await web3.eth.getAccounts(); // request user account access
      const ticketData = await getTicketsForResale();
      setTickets(ticketData);
    }
    fetchTickets();
  }, []);

  async function getTicketsForResale() {
    try {
      const totalTickets = await contract.methods.getTotalTickets().call();
      const resaleTickets = [];
  
      for (let i = 1; i <= totalTickets; i++) {
        const ticket = await contract.methods.getTicketDetails(i).call();
        if (ticket.isAvailableForResale) {
          const ticketOwner = await contract.methods.ownerOf(i).call();
          const ticketPrice = await contract.methods.getResaleTicketPrice(i).call();
          resaleTickets.push({
            ticketId: i,
            eventId: ticket.eventId,
            price: ticketPrice,
            owner: ticketOwner,
          });
        }
      }
  
      return resaleTickets;
    } catch (error) {
      console.error('Error fetching resale tickets:', error);
      return [];
    }
  }

  return (
    <div>
      <h2>Resale Tickets</h2>
      {tickets.map((ticket) => (
        <div key={ticket.ticketId}>
          <p>Ticket ID: {ticket.ticketId}</p>
          <p>Event ID: {ticket.eventId}</p>
          <p>Price: {ticket.price}</p>
          <p>Owner: {ticket.owner}</p>
        </div>
      ))}
    </div>
  );
}

export default TicketResaleList;
