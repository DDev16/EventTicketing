import React, { useEffect, useState } from "react";
import { web3, contract } from "../Event/web3.js";
import { AppBar, Toolbar, Typography, IconButton, Box, CircularProgress, Grid, List, ListItem, ListItemText, Card, CardContent, CardActions, Chip, Avatar, Collapse, CardMedia } from "@mui/material";
import { styled } from '@mui/system';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import EventForm from '../Event/EventForm.js';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';


const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
    transition: 'transform 0.2s, background 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
        background: 'linear-gradient(145deg, #cfd9df, #e2ebf0)',
    },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        borderRadius: '10px',
    },
}));
const Portal = () => {
    const [account, setAccount] = useState("");
    const [userTickets, setUserTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [openEvents, setOpenEvents] = useState([]);
    const placeholderImageUrl = "ef.jpg";
    const theme = useTheme();
const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const loadEventDetails = async (eventId) => {
        const eventDetails = await contract.methods.getEventDetails(eventId).call();
        return eventDetails;
    };

    // Load user account
    useEffect(() => {
        const loadAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        };
        loadAccount();
    }, []);

    // Load user tickets
    useEffect(() => {
        const loadTickets = async () => {
            setIsLoading(true);
            const totalTickets = await contract.methods.getTotalTickets().call();
            const tickets = [];
            const openEventsArray = [];
        
            for (let i = 1; i <= totalTickets; i++) {
                const owner = await contract.methods.ownerOf(i).call();
                if (owner === account) {
                    const ticket = await contract.methods.getTicketDetails(i).call();
                    const eventDetails = await loadEventDetails(ticket.eventId);
                    tickets.push({ id: i, ...ticket, ...eventDetails });
        
                    // Check if the event is open
                    if (eventDetails.status === "open") {
                        openEventsArray.push(eventDetails);
}
}
}
setUserTickets(tickets);
setOpenEvents(openEventsArray);
setIsLoading(false);
};

    if (account) {
        loadTickets();
    }
}, [account]);

const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
};

return (
    <>
        <StyledAppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Event Portal
                </Typography>
            </Toolbar>
        </StyledAppBar>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: isXsScreen ? '1.5rem' : '2.125rem' }}>
                        Your Open Events
                    </Typography>
                    {openEvents.length ? (
                        <List>
                            {openEvents.map((event) => (
                                <StyledCard key={event.eventId}>
                                    <CardContent>
                                        <StyledListItem>
                                            <ListItemText
                                                primary={`Event ID: ${event.eventId}`}
                                                secondary={`Event: ${event.name}`} />
                                            <ListItemText
                                                primary={`Date: ${event.date}`}
                                                secondary={`Time: ${event.time}`} />
                                        </StyledListItem>
                                    </CardContent>
                                </StyledCard>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1">
                            You have no open events.
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: isXsScreen ? '1.5rem' : '2.125rem' }}>
                        Your Tickets
                    </Typography>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {userTickets.map((ticket) => (
                                <StyledCard key={ticket.id}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={placeholderImageUrl}
                                        alt="Event placeholder"
                                    />
                                    <CardContent>
                                        <StyledListItem disableGutters>
                                            <ListItemText
                                                primary={`Ticket ID: ${ticket.id}`}
                                                secondary={`Event ID: ${ticket.eventId}`} />
                                            <ListItemText
                                                primary={`Event: ${ticket.name}`}
                                                secondary={<>
                                                    <StyledChip label={`Date: ${ticket.date}`} />
                                                    <StyledChip label={`Time: ${ticket.time}`} />
                                                    <StyledChip label={`Venue: ${ticket.venue}`} />
                                                </>} />
                                            <Avatar
                                                onClick={() => handleExpandClick(ticket.id)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                {expanded === ticket.id ? <ExpandLess /> : <ExpandMore />}
                                            </Avatar>
                                        </StyledListItem>
                                    </CardContent>
                                    <Collapse in={expanded === ticket.id} timeout="auto" unmountOnExit>
                                        <Box sx={{ paddingLeft: 2, paddingTop: 1 }}>
                                            <Typography variant="subtitle1">
                                                Additional Information
                                            </Typography>
                                            <Typography variant="body2">
                                                {ticket.additionalInfo || "No additional information available."}
                                            </Typography>
                                            <Box sx={{ paddingTop: 2 }}>
                                                <Typography variant="subtitle1">
                                                    Ticket QR Code
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 1 }}>
                                                    <QRCode value={`Event ID: ${ticket.eventId}, Purchased by: ${account}`} size={256} />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </StyledCard>

                            ))}
                    </List>
                )}
            </Grid>
        </Grid>

        <EventForm />
    </Box>
</>
);

};

export default Portal;