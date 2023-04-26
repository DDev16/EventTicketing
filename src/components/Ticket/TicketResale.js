import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { web3, contract } from '../web3';
import ResaleTicketsList from '../Ticket/ResaleTicketsList.js'; // Import the new component


const ResaleForm = () => {
  const [ticketId, setTicketId] = useState('');
  const [resalePrice, setResalePrice] = useState('');

  const handleChange = (e) => {
    e.target.name === 'ticketId'
      ? setTicketId(e.target.value)
      : setResalePrice(e.target.value);
  };

  const handleListTicket = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .listTicketForResale(ticketId, web3.utils.toWei(resalePrice, 'ether'))
      .send({ from: accounts[0] });

    setTicketId('');
    setResalePrice('');
  };

  const handleBuyResaleTicket = async (e) => {
    e.preventDefault();

    const ticket = await contract.methods.getTicketDetails(ticketId).call();
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .buyResaleTicket(ticketId)
      .send({ from: accounts[0], value: ticket.price });

    setTicketId('');
  };

  return (
    <>
      <Form onSubmit={handleListTicket}>
        <Form.Group controlId="formTicketId">
          <Form.Label>Ticket ID</Form.Label>
          <Form.Control
            type="text"
            name="ticketId"
            value={ticketId}
            onChange={handleChange}
            placeholder="Enter ticket ID"
            required
          />
        </Form.Group>
        <Form.Group controlId="formResalePrice">
          <Form.Label>Resale Price</Form.Label>
          <Form.Control
            type="text"
            name="resalePrice"
            value={resalePrice}
            onChange={handleChange}
            placeholder="Enter resale price in Ether"
            required
          />
        </Form.Group>
        <Button type="submit">List Ticket for Resale</Button>
      </Form>
      <Form onSubmit={handleBuyResaleTicket}>
        <Form.Group controlId="formBuyResaleTicketId">
          <Form.Label>Ticket ID</Form.Label>
          <Form.Control
            type="text"
            name="ticketId"
            value={ticketId}
            onChange={handleChange}
            placeholder="Enter ticket ID"
            required
          />
        </Form.Group>
        <Button type="submit">Buy Resale Ticket</Button>
      </Form>
      <ResaleTicketsList />
    </>
  );
};

export default ResaleForm;
