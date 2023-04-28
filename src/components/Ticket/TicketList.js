import { useState, useEffect } from 'react';
import { web3, contract } from '../web3.js';
import './TicketList.css';
import ticketImage from './ef.jpg';


// TicketResaleList is a React component that displays a list of resale tickets.
function TicketResaleList() {
  const [tickets, setTickets] = useState([]);

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

        resaleTickets.push({
          ticketId: i,
          eventId: ticket.eventId,
          price: ticketPrice,
          owner: ticketOwner,
        });
      }
    }

    return resaleTickets;
  }

  // Render the resale ticket list.
  return (
    <div className="container">
      {tickets.map((ticket) => (
        <div key={ticket.ticketId} className="ticket">
          <div className="ticket-image">
            {ticket.imageUrl ? (
              <img src={ticket.imageUrl} alt="Ticket" />
            ) : (
<img src={ticket.imageUrl ? ticket.imageUrl : ticketImage} alt="Ticket" />
            )}
          </div>
          <div className="ticket-info">
            <h3>Ticket ID: {ticket.ticketId}</h3>
            <p>Event ID: {ticket.eventId}</p>
            <p>Price: ${ticket.price}</p>
            <p>Owner: {ticket.owner}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TicketResaleList;