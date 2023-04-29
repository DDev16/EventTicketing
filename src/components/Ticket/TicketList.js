
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Collapse,
  CardMedia,
  TextField,
  Button,
  } from "@mui/material";
  import { styled } from "@mui/system";
  import { ExpandLess, ExpandMore } from "@mui/icons-material";
  
  import { useState, useEffect, useCallback } from "react";
  import { web3, contract } from "../web3.js";
  import "./TicketList.css";
  import ticketImage from "./ef.jpg";
  
  const ElegantAppBar = styled(AppBar)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  });
  
  function TicketResaleList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  
  const fetchTickets = useCallback(async () => {
  try {
  await web3.eth.getAccounts();
  const ticketData = await getTicketsForResale();
  setTickets(ticketData);
  } catch (error) {
  console.error("Error fetching resale tickets:", error);
  }
  }, []);
  
  useEffect(() => {
  fetchTickets();
  }, [fetchTickets]);
  
  async function getTicketsForResale() {
  const totalTickets = await contract.methods.getTotalTickets().call();
  const resaleTickets = [];

  for (let i = 1; i <= totalTickets; i++) {
    const ticket = await contract.methods.getTicketDetails(i).call();
  
    if (ticket.isAvailableForResale) {
      const ticketOwner = await contract.methods.ownerOf(i).call();
      const ticketPrice = await contract.methods.getResaleTicketPrice(i).call();
  
      resaleTickets.push({
        ticketId: i,
        eventId: ticket.eventId,
        price: ticketPrice,
        owner: ticketOwner,
      });
    }
  }
  
  return resaleTickets;
  }
  
  async function buyResaleTicket(ticketId, price) {
  try {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.buyResaleTicket(ticketId).send({ from: accounts[0], value: price });
  alert('Ticket purchase successful!');
  fetchTickets();
  } catch (error) {
  console.error('Error buying resale ticket:', error);
  alert('Ticket purchase failed. Please try again.');
  }
  }
  
  function handleSearchInput(event) {
  setSearch(event.target.value);
  }
  
  return (
  <Box className="container">
  <ElegantAppBar position="static">
  <Toolbar>
  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  Ticket Resale Marketplace
  </Typography>
  </Toolbar>
  </ElegantAppBar>
  <Box className="search-container">
  <TextField
         type="text"
         label="Search by event ID"
         variant="outlined"
         value={search}
         onChange={handleSearchInput}
         fullWidth
       />
  </Box>
  <Grid container spacing={2} className="tickets-container">
  {tickets
  .filter((ticket) => ticket.eventId.includes(search))
  .map((ticket) => (
  <Grid item xs={12} sm={6} md={4} key={ticket.ticketId}>
  <Card>
  
              <CardMedia
                component="img"
                height="140"
                image={ticket.imageUrl ? ticket.imageUrl : ticketImage}
                alt="Ticket"
              />
  
              <CardContent>
                <Typography variant="h6">Ticket ID: {ticket.ticketId}</Typography>
                <Typography variant="body1">Event ID: {ticket.eventId}</Typography>
                <Typography variant="body1">Price: ${ticket.price}</Typography>
                <Typography variant="body1">Owner: {ticket.owner}</Typography>
              </CardContent>
  
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => buyResaleTicket(ticket.ticketId, ticket.price)}
                >
                  Buy Ticket
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  </Box>
  );
  }
  
  export default TicketResaleList;