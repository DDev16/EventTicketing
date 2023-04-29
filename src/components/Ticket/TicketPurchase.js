import { AppBar, Toolbar, Typography, IconButton, Box, CircularProgress, Grid, List, ListItem, ListItemText, Card, CardContent, CardActions, Chip, Avatar, Collapse, CardMedia } from "@mui/material";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

import React, { useState, useEffect } from 'react';
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
    <Box className="ticket-purchase">
      <Typography variant="h4" gutterBottom>Buy Ticket</Typography>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      {success && (
        <Alert severity="success">{success}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="eventId"
            label="Event ID"
            type="number"
            placeholder="Enter event id"
            variant="outlined"
            fullWidth
            onChange={(e) => setEventId(e.target.value)}
          />
          {remainingTickets !== null && remainingTickets === 0 && (
            <Alert severity="error">This event is sold out.</Alert>
          )}
          {remainingTickets !== null && remainingTickets > 0 && (
            <Alert severity="info">
              There are only {remainingTickets} tickets left for this event. Purchase now to avoid disappointment!
            </Alert>
          )}
          <Button variant="contained" color="primary" type="submit" disabled={!eventId || remainingTickets === 0 || loading}>
            {loading && <CircularProgress size={24} />} Purchase
          </Button>
        </Stack>
      </form>
      {ticketDetails && (
       <Box className="ticket-details-container">
       <Typography variant="h4" gutterBottom>Ticket Details</Typography>
       <Typography variant="body1">Event Name: {ticketDetails.eventName}</Typography>
       <Typography variant="body1">Ticket Price: {ticketDetails.ticketPrice} ETH</Typography>
       <Typography variant="body1">Purchase Date: {ticketDetails.purchaseDate}</Typography>
       <Typography variant="body1">Owner Address: {ticketDetails.owner}</Typography>
       <Button variant="contained" color="primary" onClick={() => setShowQR(true)}>View QR Code</Button>
     </Box>
      )}
      <Modal
        open={showQR}
        onClose={handleCloseQR}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: 400, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Your Ticket QR Code
          </Typography>
          <Box my={2}>
            <QRCode value={qrData} size={256} />
          </Box>
          <Button variant="outlined" color="secondary" onClick={handleCloseQR}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TicketPurchase;