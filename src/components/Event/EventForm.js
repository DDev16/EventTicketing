
import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { NFTStorage, File } from 'nft.storage';
import { AppBar, Toolbar, Typography, IconButton, Box, CircularProgress, Grid, List, ListItem, ListItemText, Card, CardContent, CardActions, Chip, Avatar, Collapse, CardMedia } from '@mui/material';
import './EventForm.css';
import { web3, contract } from './web3';
import { Button } from '@mui/material';
import EventImage from '../Event/download (6).jpg';



const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdGOTA4QjNBRDJGMDFGNjE2MjU1MTA0ODIwNjFmNTY5Mzc2QTg3MjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3OTI5MDE5ODQyMCwibmFtZSI6Ik5FV0VTVCJ9.FGtIrIhKhgSx-10iVlI4sM_78o7jSghZsG5BpqZ4xfA';
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
    console.log('fileUrl', fileUrl);
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
          type: mimeType,
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
          metadata.url
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

  const handleUpdate = async (e) => {e.preventDefault();
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
      fileUrl
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
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Form
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia component="img" height="300" image={EventImage} alt="Event" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Event Details
              </Typography>
              <form onSubmit={handleSubmit}>
                <List>
                  <ListItem>
                    <ListItemText primary="Event Name" />
                    <FormControl type="text" name="name" value={formData.name} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Event Date" />
                    <FormControl type="date" name="date" value={formData.date} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Event Time" />
                    <FormControl type="time" name="time" value={formData.time} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Event Venue" />
                    <FormControl type="text" name="venue" value={formData.venue} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Event Description" />
                    <FormControl as="textarea" name="description" value={formData.description} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Performers" />
                    <FormControl type="text" name="performers" value={formData.performers} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Organizer" />
                    <FormControl type="text" name="organizer" value={formData.organizer} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Ticket Price (ETH)" />
                    <FormControl type="number" step="0.01" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Max Tickets per Event" />
                    <FormControl type="number" name="maxTicketsPerEvent" value={formData.maxTicketsPerEvent} onChange={handleChange} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Event Image" />
                    <FormControl type="file" name="image" accept="
image/*" onChange={handleChange} />
</ListItem>
<ListItem>
<CardActions>
<Button type="submit" disabled={loading}>
Create Event
</Button>
</CardActions>
</ListItem>
</List>
</form>
</CardContent>
</Card>
</Grid>
<Grid item xs={12} sm={6}>
<Card>
<CardContent>
<Typography gutterBottom variant="h5" component="div">
Update Event
</Typography>
<List>
<ListItem>
<ListItemText primary="Event ID to Update" />
<FormControl type="number" name="updateId" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
</ListItem>
<ListItem>
<ListItemText primary="Event Name" />
<FormControl type="text" name="name" value={formData.name} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Event Date" />
<FormControl type="date" name="date" value={formData.date} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Event Time" />
<FormControl type="time" name="time" value={formData.time} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Event Venue" />
<FormControl type="text" name="venue" value={formData.venue} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Event Description" />
<FormControl as="textarea" name="description" value={formData.description} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Performers" />
<FormControl type="text" name="performers" value={formData.performers} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Organizer" />
<FormControl type="text" name="organizer" value={formData.organizer} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Ticket Price (ETH)" />
<FormControl type="number" step="0.01" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} />
</ListItem>
<ListItem>
<ListItemText primary="Event Image" />
<Button
                 variant="contained"
                 component="label"
                 disabled={loading}
               >
Upload Image
<input
                   type="file"
                   name="image"
                   accept="image/*"
                   hidden
                   onChange={handleChange}
                 />
</Button>
</ListItem>
<ListItem>
<Collapse in={fileUrl !== null}>
<Box sx={{ display: 'flex', alignItems: 'center' }}>
<Avatar sx={{ mr: 2 }}>
<img src={fileUrl} alt="File URL" />
</Avatar>
<Chip label={fileUrl} />
</Box>
</Collapse>
</ListItem>
<ListItem>
<CardActions>
<Button type="button" onClick={handleUpdate} disabled={loading}>
Update Event
</Button>
</CardActions>
</ListItem>
</List>
</CardContent>
</Card>
</Grid>
</Grid>
{loading && (
<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
<CircularProgress size={24} />
<Typography variant="subtitle1" component="div" sx={{ ml: 1 }}>
Uploading image to NFT.storage, please wait...
</Typography>
</Box>
)}
</Box>
</Box>
);
};

export default EventForm;