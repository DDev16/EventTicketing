import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { web3, contract } from './web3';
import './EventList.css';


const EventList = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const numberOfEvents = await contract.methods.getNumberOfEvents().call();
    const eventsData = [];

    for (let i = 1; i <= numberOfEvents; i++) {
      const event = await contract.methods.getEventDetails(i).call();
      eventsData.push({ ...event, id: i });
    }

    setEvents(eventsData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Table striped bordered hover className="event-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Venue</th>
          <th>Description</th>
          <th>Performers</th>
          <th>Organizer</th>
          <th>Ticket Price (ETH)</th>
          <th>Max Tickets per Event</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.name}</td>
            <td>{event.date}</td>
            <td>{event.time}</td>
            <td>{event.venue}</td>
            <td>{event.description}</td>
            <td>{event.performers}</td>
            <td>{event.organizer}</td>
            <td>{web3.utils.fromWei(event.ticketPrice, 'ether')}</td>
            <td>{event.maxTicketsPerEvent}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default EventList;
