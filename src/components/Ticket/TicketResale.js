import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { web3, contract } from '../web3';
import ResaleTicketsList from '../Ticket/ResaleTicketsList';
import "./TicketResale.css"

const ResaleForm = () => {
  const [ticketId, setTicketId] = useState('');
  const [resalePrice, setResalePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === 'ticketId' ? setTicketId(value) : setResalePrice(value);
  };

  const handleListTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .listTicketForResale(ticketId, web3.utils.toWei(resalePrice, 'ether'))
        .send({ from: accounts[0] });

      setMessage('Ticket successfully listed for resale.');
      setTicketId('');
      setResalePrice('');
    } catch (err) {
      setError('Error listing ticket for resale: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyResaleTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const ticket = await contract.methods.getTicketDetails(ticketId).call();
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .buyResaleTicket(ticketId)
        .send({ from: accounts[0], value: ticket.price });

      setMessage('Resale ticket successfully purchased.');
      setTicketId('');
    } catch (err) {
      setError('Error buying resale ticket: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && <Alert className="alert-success">{message}</Alert>}
      {error && <Alert className="alert-danger">{error}</Alert>}

      <div className="resale-container">
        <h1 className="h1">Resale Tickets</h1>
        <Form onSubmit={handleListTicket}>
          <Form.Group className="form-group" controlId="formTicketId">
            <Form.Label className="form-label">Ticket ID</Form.Label>
            <Form.Control
              className="form-control"
              type="number"
              min="0"
              name="ticketId"
              value={ticketId}
              onChange={handleChange}
              placeholder="Enter ticket ID"
              required
            />
          </Form.Group>
          <Form.Group className="form-group" controlId="formResalePrice">
            <Form.Label className="form-label">Resale Price</Form.Label>
            <Form.Control
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              name="resalePrice"
              value={resalePrice}
              onChange={handleChange}
              placeholder="Enter resale price in Ether"
              required
            />
          </Form.Group>
          <Button className="button" type="submit" disabled={loading}>
            {loading ? 'Listing...' : 'List Ticket for Resale'}
          </Button>
        </Form>

       
      </div>

    </>
  );
};

export default ResaleForm;