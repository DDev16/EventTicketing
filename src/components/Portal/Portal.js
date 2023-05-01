import React, { useEffect, useState } from "react";
import { web3, contract } from "../Event/web3.js";
import { AppBar, Typography, Box, CircularProgress, Grid, List, ListItem, ListItemText, Card, CardContent, Chip, Avatar, Collapse, CardMedia } from "@mui/material";
import { styled } from '@mui/system';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import { useTheme, useMediaQuery } from '@mui/material';

import placeholderImageUrl from './ef.jpg'

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
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [userEvents, setUserEvents] = useState([]);

    const loadEventDetails = async (eventId) => {
        const eventDetails = await contract.methods.getEventDetails(eventId).call();
        return eventDetails;
    };

    const loadEvents = async () => {
        setIsLoading(true);
        const totalEvents = await contract.methods.getNumberOfEvents().call();
        const events = [];
    
        for (let i = 1; i <= totalEvents; i++) {
            const eventDetails = await contract.methods.getEventDetails(i).call();
            if (eventDetails.creator.toLowerCase() === account.toLowerCase()) {
                events.push({ id: i, ...eventDetails });
            }
        }
        setUserEvents(events);
        setIsLoading(false);
    };
    

    useEffect(() => {
        const loadAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        };
        loadAccount();
    }, []);

    useEffect(() => {
        const loadTickets = async () => {
            setIsLoading(true);
            const totalTickets = await contract.methods.getTotalTickets().call();
            const tickets = [];

            setUserTickets([]);

            for (let i = 1; i <= totalTickets; i++) {
                const owner = await contract.methods.ownerOf(i).call();
                if (owner === account) {
                    const ticket = await contract.methods.getTicketDetails(i).call();
                    const eventDetails = await loadEventDetails(ticket.eventId);
                    tickets.push({ id: i, ...ticket, ...eventDetails });

                }
            }
            setUserTickets(tickets);
            setIsLoading(false);
        };

        loadTickets();
    }, [account]);

    const handleExpandClick = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    useEffect(() => {
        if (account) {
            loadEvents();
        }
    }, [account]);
    

    const ListForSaleButton = ({ ticketId, eventId }) => {
        const [resalePrice, setResalePrice] = useState(0);


        const handleListForSale = async () => {
            try {
                await contract.methods.listTicketForResale(ticketId, resalePrice, eventId).send({ from: account });
                alert('Ticket successfully listed for resale');
            } catch (error) {
                console.error(error);
                alert('Error listing ticket for resale');
            }
        };

        return (
            <>
                <input
                    type="number"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(e.target.value)}
                    placeholder="Resale Price"
                />
                <button onClick={handleListForSale}>List for Sale</button>
            </>
        );
    };

    const DelistButton = ({ ticketId }) => {
        const handleDelist = async () => {
            try {
                await contract.methods.delistTicketFromResale(ticketId).send({ from: account });
                alert('Ticket successfully delisted from resale');
            } catch (error) {
                console.error(error);
                alert('Error delisting ticket from resale');
            }
        };


        return <button onClick={handleDelist}>Delist</button>;
    };

    return (
        <>
            <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
                <StyledAppBar position="static">
                </StyledAppBar>
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    <Grid container spacing={3}>
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
                                                        <Box sx={{ paddingTop: 2 }}>
                                                            {!ticket.isAvailableForResale ? (
                                                                <ListForSaleButton ticketId={ticket.id} eventId={ticket.eventId} />
                                                            ) : (
                                                                <DelistButton ticketId={ticket.id} />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        </StyledCard>
                                    ))}
                                </List>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: isXsScreen ? '1.5rem' : '2.125rem' }}>
                                Your Events
                            </Typography>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <List>
                                    {userEvents.map((event) => (
                                        <StyledCard key={event.id}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={placeholderImageUrl}
                        alt="Event placeholder"
                    />
                    <CardContent>
                        <StyledListItem disableGutters>
                            <ListItemText
                                primary={`Event ID: ${event.id}`}
                                secondary={`Event: ${event.name}`} />
                            <ListItemText
                                secondary={<>
                                    <StyledChip label={`Date: ${event.date}`} />
                                    <StyledChip label={`Time: ${event.time}`} />
                                    <StyledChip label={`Venue: ${event.venue}`} />
                                </>} />
                        </StyledListItem>
                    </CardContent>
                </StyledCard>                                    ))}
                                </List>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
    
    };
    
    export default Portal;