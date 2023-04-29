import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, CircularProgress, Grid, Card, CardContent, Avatar, CardMedia, Button, Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { styled } from '@mui/system';
import { web3, contract } from './web3';
import image1 from '../Ticket/ef.jpg';
import image2 from '../Ticket/ll.jpg';

const EventList = () => {
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(false);
const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });

const fetchEvents = async () => {
setLoading(true);
const numberOfEvents = await contract.methods.getNumberOfEvents().call();
const eventsData = [];

for (let i = 1; i <= numberOfEvents; i++) {
  const event = await contract.methods.getEventDetails(i).call();
  let imageUrl;

  if (i % 2 === 0) {
    imageUrl = image1;
  } else {
    imageUrl = image2;
  }

  eventsData.push({ ...event, id: i, imageUrl });
}

setEvents(eventsData);
setLoading(false);
};

useEffect(() => {
fetchEvents();
}, []);

const handleBuyTicket = async (eventId) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.buyTicket(eventId).send({
      from: accounts[0],
      value: events.find(event => event.id === eventId).ticketPrice,
    });
    console.log("Ticket purchased successfully");
  } catch (error) {
    console.error(error);
    setErrorSnackbar({ open: true, message: 'Error: Unable to purchase ticket. All tickets might be sold.' });
  }
};


const handleCloseSnackbar = () => {
  setErrorSnackbar({ ...errorSnackbar, open: false });
};


const StyledCardMedia = styled(CardMedia)`
width: 70%;
height: 400px;
margin: 0 auto;
display: flex;
justify-content: center;
align-items: center;
border-radius: 10px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
position: relative;
transition: all 0.3s ease-in-out;

&:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
}
`;

return (
  <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>

<Box>
<AppBar position="static">
<Toolbar>
  <Typography variant="h4">
    Event List
  </Typography>



</Toolbar>
</AppBar>
{loading ? (
<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
<CircularProgress />
</Box>
) : (
<Grid container spacing={2}>
{events.map((event) => (
<Grid item xs={12} md={6} key={event.id}>
<Card>
<StyledCardMedia
               component="img"
               alt={event.name}
               height={400}
               image={event.imageUrl}
               title={event.name}
             />
<CardContent>
<Typography gutterBottom variant="h5" component="h1">
{event.name}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
Date: {event.date}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
Time: {event.time}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
Venue: {event.venue}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
Description: {event.description}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Performers: {event.performers}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Organizer: {event.organizer}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Ticket Price (ETH): {web3.utils.fromWei(event.ticketPrice, 'ether')}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Max Tickets per Event: {event.maxTicketsPerEvent}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleBuyTicket(event.id)}>
                Buy Ticket
              </Button>
              <Snackbar
      open={errorSnackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
        {errorSnackbar.message}
      </Alert>
    </Snackbar>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
</Box>
</div>
);
};

export default EventList;