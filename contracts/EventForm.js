import React, { useState } from 'react';
import { Button, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import './EventForm.css';
import { web3, contract } from './web3';



const EventForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    performers: '',
    organizer: '',
    ticketPrice: 0,
    maxTicketsPerEvent: 0,
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const accounts = await web3.eth.getAccounts();
  
    const imageFile = e.target.image.files[0];
    const imageCID = await uploadImageToIPFS(imageFile);
  
    await contract.methods
      .createEvent(
        formData.name,
        formData.date,
        formData.time,
        formData.venue,
        formData.description,
        formData.performers,
        formData.organizer,
        web3.utils.toWei(formData.ticketPrice, 'ether'),
        formData.maxTicketsPerEvent,
        imageCID // add image CID to function arguments
      )
      .send({ from: accounts[0] });
  
    setFormData({
      name: '',
      date: '',
      time: '',
      venue: '',
      description: '',
      performers: '',
      organizer: '',
      ticketPrice: '',
      maxTicketsPerEvent: '',
      
    });
  };
  
  async function uploadImageToIPFS(imageFile) {
    const apiUrl = 'https://api.nft.storage/upload';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdGOTA4QjNBRDJGMDFGNjE2MjU1MTA0ODIwNjFmNTY5Mzc2QTg3MjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3OTI5MDE5ODQyMCwibmFtZSI6Ik5FV0VTVCJ9.FGtIrIhKhgSx-10iVlI4sM_78o7jSghZsG5BpqZ4xfA`,
      },
      body: imageFile,
    });
    const data = await response.json();
    return data.value.cid;
  }
  

  return (
    <div className="EventForm">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Event Name</FormLabel>
          <FormControl
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Event Date</FormLabel>
          <FormControl
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Event Time</FormLabel>
          <FormControl
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Event Venue</FormLabel>
          <FormControl
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Event Description</FormLabel>
          <FormControl
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Performers</FormLabel>
<FormControl
           type="text"
           name="performers"
           value={formData.performers}
           onChange={handleChange}
         />
</FormGroup>
<FormGroup>
<FormLabel>Organizer</FormLabel>
<FormControl
           type="text"
           name="organizer"
           value={formData.organizer}
           onChange={handleChange}
         />
</FormGroup>
<FormGroup>
<FormLabel>Ticket Price (ETH)</FormLabel>
<FormControl
           type="number"
           step="0.01"
           name="ticketPrice"
           value={formData.ticketPrice}
           onChange={handleChange}
         />
</FormGroup>
<FormGroup>
<FormLabel>Max Tickets per Event</FormLabel>
<FormControl
           type="number"
           name="maxTicketsPerEvent"
           value={formData.maxTicketsPerEvent}
           onChange={handleChange}
         />
</FormGroup>
<FormLabel>Event Image</FormLabel>
<FormGroup>
<FormControl type="file" name="image" onChange={handleChange} />
  </FormGroup>

      <Button type="submit">Create Event</Button>
    </Form>
  </div>
);
};

export default EventForm;