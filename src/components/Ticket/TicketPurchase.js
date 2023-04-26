import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { web3 } from '../web3';
import EventTicketingABI from '../EventTicketingABI.json'; // Adjust the path accordingly
import "../Ticket/TicketPurchase.css"


const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

const contract = new web3.eth.Contract(EventTicketingABI, contractAddress);

const TicketPurchase = () => {
    const [eventId, setEventId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.buyTicket(eventId).send({ from: accounts[0], value: 1000000000000000000 });
            setSuccess("Ticket purchased successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="ticket-purchase">
            <h1>Purchase Ticket</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventId">
                    <Form.Label>Event ID</Form.Label>
                    <Form.Control type="number" placeholder="Enter event id" onChange={(e) => setEventId(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Purchase
                </Button>
            </Form>
        </div>
    );
};

export default TicketPurchase;