import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { web3, contract } from '../web3';


const ResaleTicketsList = () => {
  const [resaleTickets, setResaleTickets] = useState([]);

  useEffect(() => {
    const fetchResaleTickets = async () => {
      const totalTickets = await contract.methods.getTotalTickets().call();
      let resaleTicketsArray = [];

      for (let i = 1; i <= totalTickets; i++) {
        const ticket = await contract.methods.getTicketDetails(i).call();
        const owner = await contract.methods.ownerOf(i).call();
        if (ticket.isAvailableForResale) {
          resaleTicketsArray.push({ id: i, price: ticket.price, owner });
        }
      }

      console.log('Resale tickets:', resaleTicketsArray); // Log resale tickets
      setResaleTickets(resaleTicketsArray);
    };

    fetchResaleTickets();
  }, []);

  return (
    <>
      <h2>Resale Tickets</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Price (Ether)</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {resaleTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{web3.utils.fromWei(ticket.price, 'ether')}</td>
              <td>{ticket.owner}</td>
            </tr>
          ))}
        </tbody>
        
      </Table>
      
    </>
  );
};

export default ResaleTicketsList;
