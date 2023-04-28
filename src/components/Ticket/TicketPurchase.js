import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Modal, Spinner } from 'react-bootstrap';
import { web3 } from '../web3';
import EventTicketingABI from '../EventTicketingABI.json';
import "../Ticket/TicketPurchase.css";
import QRCode from 'qrcode.react';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contract = new web3.eth.Contract(EventTicketingABI, contractAddress);

const TicketPurchase = () => {
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remainingTickets, setRemainingTickets] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await contract.methods.getEventDetails(eventId).call();
        setRemainingTickets(event.totalTickets - event.ticketsSold);
      } catch (err) {
        console.error(err);
      }
    };
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (window.confirm("Are you sure you want to purchase this ticket?")) {
      setLoading(true);
      try {
        const accounts = await web3.eth.getAccounts();
        const event = await contract.methods.getEventDetails(eventId).call();
        const ticketPrice = event.ticketPrice;
        await contract.methods.buyTicket(eventId).send({ from: accounts[0], value: ticketPrice });

        const qrCodeData = `Event ID: ${eventId}, Purchased by: ${accounts[0]}`;
        setQrData(qrCodeData);
        setSuccess("Ticket purchased successfully!");

        const ticket = {
          eventName: event.eventName,
          ticketPrice: ticketPrice,
          purchaseDate: new Date().toLocaleString(),
          owner: accounts[0],
        };
        setTicketDetails(ticket);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setQrData(null);
  };

  return (
    <div className="ticket-purchase">
      <h2>Purchase Ticket</h2>
      {error && (
        <Alert variant="danger">{error}</Alert>
)}
{success && (
<Alert variant="success">{success}</Alert>
)}
<Form onSubmit={handleSubmit}>
<Form.Group controlId="eventId">
<Form.Label>Event ID</Form.Label>
<Form.Control type="number" placeholder="Enter event id" onChange={(e) => setEventId(e.target.value)} />
</Form.Group>
{remainingTickets !== null && remainingTickets === 0 && (
<Alert variant="danger">This event is sold out.</Alert>
)}
{remainingTickets !== null && remainingTickets > 0 && (
<Alert variant="info">
There are only {remainingTickets} tickets left for this event. Purchase now to avoid disappointment!
</Alert>
)}
<Button variant="primary" type="submit" disabled={!eventId || remainingTickets === 0 || loading}>
{loading && <Spinner animation="border" size="sm" />} Purchase
</Button>
</Form>
{ticketDetails && (
<div className="ticket-details-container">
<h1>Ticket Details</h1>
<p>Event Name: {ticketDetails.eventName}</p>
<p>Ticket Price: {ticketDetails.ticketPrice} ETH</p>
<p>Purchase Date: {ticketDetails.purchaseDate}</p>
<p>Owner Address: {ticketDetails.owner}</p>
<Button variant="primary" onClick={() => setShowQR(true)}>View QR Code</Button>
</div>
)}
<Modal show={showQR} onHide={handleCloseQR}>
<Modal.Header closeButton>
<Modal.Title>Your Ticket QR Code</Modal.Title>
</Modal.Header>
<Modal.Body>
<QRCode value={qrData} size={256} />
</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={handleCloseQR}>
Close
</Button>
</Modal.Footer>
</Modal>
</div>
);
};

export default TicketPurchase;