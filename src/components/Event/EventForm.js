import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, FormControl, FormLabel, Spinner } from 'react-bootstrap';
import './EventForm.css';
import { web3, contract } from './web3';
import { NFTStorage, File } from 'nft.storage';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdGOTA4QjNBRDJGMDFGNjE2MjU1MTA0ODIwNjFmNTY5Mzc2QTg3MjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3OTI5MDE5ODQyMCwibmFtZSI6Ik5FV0VTVCJ9.FGtIrIhKhgSx-10iVlI4sM_78o7jSghZsG5BpqZ4xfA'; // Replace with your API key from NFT.storage
const client = new NFTStorage({ token: apiKey });

const getMimeType = (file) => {
  const mimeType = file.type;
  return mimeType;
};

const EventForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateId, setUpdateId] = useState('');

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

  useEffect(() => {
    console.log("fileUrl", fileUrl);
  }, [fileUrl]);

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'file' ? target.files[0] : target.value;
    const name = target.name;

    if (name === 'image') {
      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      console.log('Accounts:', accounts);

      if (!formData.image) {
        setLoading(false);
        alert('Please upload an image for the event.');
        return;
      }
      setFileUrl(formData.image);

      const mimeType = getMimeType(formData.image);
      console.log('Uploading image to NFT.storage...');
      const metadata = await client.store({
        name: formData.name,
        description: formData.description,
        image: new File([formData.image], formData.image.name, {
          type: mimeType, // Set the correct MIME type
        }),
      });
      console.log('Image uploaded, metadata:', metadata);

      console.log('Creating event on the contract...');
      const createEventResponse = await contract.methods
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
          metadata.url // Pass the metadata URL as a parameter
        )
        .send({ from: accounts[0] });
      console.log('Event created:', createEventResponse);

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
        image: null,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      const updateEventResponse = await contract.methods
        .updateEventDetails(
          updateId,
          formData.name,
          formData.date,
          formData.time,
          formData.venue,
          formData.description,
          formData.performers,
          formData.organizer,
          web3.utils.toWei(formData.ticketPrice, 'ether'),
          fileUrl // Pass the image CID as a parameter
        )
        .send({ from: accounts[0] });
      console.log('Event updated:', updateEventResponse);

      setUpdateId('');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('An error occurred while updating the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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
        <FormGroup>
          
          <FormLabel>Event Image</FormLabel>
          <FormControl
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </FormGroup>
      
        <div className="Button">
<Button type="submit" disabled={loading}>
Create Event
</Button>
<FormGroup>
  <FormLabel>Event ID to Update</FormLabel>
  <FormControl
    type="number"
    name="updateId"
    value={updateId}
    onChange={(e) => setUpdateId(e.target.value)}
  />
</FormGroup>

<Button type="button" onClick={handleUpdate} disabled={loading}>
  Update Event
</Button>

</div>
{loading && (
<div className="text-center">
<Spinner animation="border" role="status">
<span className="visually-hidden">Uploading image to NFT.storage, please wait...</span>
</Spinner>
<p>Uploading image to NFT.storage, please wait...</p>
</div>
)}
</Form>
{previewImage && (
<img
src={previewImage}
alt="Preview"
style={{ maxWidth: '400px', height: '400px', marginTop: '10px' }}
/>
)}
</div>


);
};

export default EventForm;