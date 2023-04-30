import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { web3, contract } from '../web3';
import "./TicketResale.css"

const ResaleForm = () => {
  const [eventId, setEventId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [resalePrice, setResalePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ticketId') {
      setTicketId(value);
    } else if (name === 'resalePrice') {
      setResalePrice(value);
    } else {
      setEventId(value);
    }
  };

  const handleListTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const accounts = await web3.eth.getAccounts();

      // Pass eventId as an argument
      await contract.methods
        .listTicketForResale(ticketId, web3.utils.toWei(resalePrice, 'ether'), eventId)
        .send({ from: accounts[0] });

      setMessage('Ticket successfully listed for resale.');
      setTicketId('');
      setResalePrice('');
      setEventId('');
    } catch (err) {
      setError('Error listing ticket for resale: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelistTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .delistTicketFromResale(ticketId)
        .send({ from: accounts[0] });

      setMessage('Ticket successfully delisted from resale.');
      setTicketId('');
    } catch (err) {
      setError('Error delisting ticket from resale: ' + err.message);
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
          <Form.Group className="form-group" controlId="formEventId">
            <Form.Label className="form-label">Event ID</Form.Label>
            <Form.Control
              className="form-control"
              type="number"
              min="0"
              name="eventId"
              value={eventId}
              onChange={handleChange}
              placeholder="Enter event ID"
              required
            />
          </Form.Group>
          <Button className="button" onClick={handleListTicket} disabled={loading}>
            {loading ? 'Listing...' : 'List Ticket for Resale'}
          </Button>
          <Button className="button" onClick={handleDelistTicket} disabled={loading}>
            {loading ? 'Delisting...' : 'De-list Ticket from Resale'}
          </Button>
        </Form>

       
      </div>

    </>
  );
};

export default ResaleForm;