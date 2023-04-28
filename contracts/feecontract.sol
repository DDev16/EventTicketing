// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EventTicketing is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Address for address payable;
    using SafeMath for uint256;

    Counters.Counter private _ticketIds;
    Counters.Counter private _eventIds;


    uint256 private MAX_RESALE_PERCENT = 150;
    uint256 private RESALE_FEE_PERCENT = 5;
    uint256 private MAX_RESALE_COUNT = 2;
    uint256 private OWNER_FEE_PERCENT = 5;

    struct Event {
        string name;
        string date;
        string time;
        string venue;
        string description;
        string performers;
        string organizer;
        uint256 ticketPrice;
        uint256 maxTicketsPerEvent;
        string imageCID;
        address payable creator;
    }
    
    struct Ticket {
        uint256 eventId;
        uint256 price;
        uint256 resaleCount;
        bool isAvailableForResale;
    }
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => bool) private _soldTickets;
    mapping(uint256 => uint256) private _soldTicketsPerEvent;

    event EventDetailsUpdated(uint256 eventId, address indexed updater);
    event EventOwnershipTransferred(uint256 eventId, address oldOwner, address newOwner);
    event EventFeesUpdated(uint256 maxResalePercent, uint256 resaleFeePercent, uint256 ownerFeePercent);
    event TicketListedForResale(uint256 ticketId, uint256 resalePrice);
    event TicketDelistedFromResale(uint256 ticketId);
    event TicketResalePriceUpdated(uint256 ticketId, uint256 newResalePrice);
    event OwnerWithdrew(uint256 amount);
    event TicketPurchased(address indexed buyer, uint256 ticketId, uint256 eventId);
    event TicketResold(uint256 ticketId, address oldOwner, address newOwner, uint256 resalePrice);
    event EventCreated(uint256 eventId, address indexed creator);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function createEvent(
        string memory _eventName,
        string memory _eventDate,
        string memory _eventTime,
        string memory _eventVenue,
        string memory _eventDescription,
        string memory _eventPerformers,
        string memory _eventOrganizer,
        uint256 _ticketPrice,
        uint256 _maxTicketsPerEvent,
        string memory _imageCID
    ) public {
        _eventIds.increment();
        uint256 eventId = _eventIds.current();

        events[eventId] = Event({
            name: _eventName,
            date: _eventDate,
            time: _eventTime,
            venue: _eventVenue,
            description: _eventDescription,
            performers: _eventPerformers,
            organizer: _eventOrganizer,
            ticketPrice: _ticketPrice,
            maxTicketsPerEvent: _maxTicketsPerEvent,
            imageCID: _imageCID,
            creator: payable(msg.sender)
        });

        emit EventCreated(eventId, msg.sender);
    }

    function updateFees(
        uint256 _maxResalePercent,
        uint256 _resaleFeePercent,
        uint256 _ownerFeePercent
    ) public onlyOwner {
        MAX_RESALE_PERCENT = _maxResalePercent;
        RESALE_FEE_PERCENT = _resaleFeePercent;
        OWNER_FEE_PERCENT = _ownerFeePercent;

    emit EventFeesUpdated(_maxResalePercent, _resaleFeePercent, _ownerFeePercent);

    }


    function updateMaxTicketsPerEvent(uint256 eventId, uint256 count) public onlyOwner {
    require(eventId <= _eventIds.current(), "Invalid event ID");

    events[eventId].maxTicketsPerEvent = count;
}

    function transferEventOwnership(uint256 eventId, address payable newOwner) public onlyOwner {
    require(eventId <= _eventIds.current(), "Invalid event ID");

    events[eventId].creator = newOwner;
        
    emit EventOwnershipTransferred(eventId, msg.sender, newOwner);

}

    function setTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
    setTokenURI(tokenId, uri);
}

    function buyTicket(uint256 eventId) public payable {
        require(eventId <= _eventIds.current(), "Invalid event ID");
        require(msg.value == events[eventId].ticketPrice, "Incorrect payment amount");
        require(_soldTicketsPerEvent[eventId] < events[eventId].maxTicketsPerEvent, "All tickets sold");

        _ticketIds.increment();
        uint256 ticketId = _ticketIds.current();

        tickets[ticketId] = Ticket({ eventId: eventId, price: 0, resaleCount: 0, isAvailableForResale: false });
        _safeMint(msg.sender, ticketId);
        _soldTickets[ticketId] = true;
        _soldTicketsPerEvent[eventId]++;

        uint256 ownerFee = (msg.value * OWNER_FEE_PERCENT) / 100;
        uint256 creatorPayment = msg.value - ownerFee;

        events[eventId].creator.sendValue(creatorPayment); // Send ticket sales amount to the event creator
        payable(owner()).sendValue(ownerFee); // Send the owner fee to the contract owner

        emit TicketPurchased(msg.sender, ticketId, eventId);
    }

    function isTicketSold(uint256 ticketId) public view returns (bool) {
        return _soldTickets[ticketId];
    }

    function updateMaxResaleCount(uint256 count) public onlyOwner {
    MAX_RESALE_COUNT = count;
}


    function updateEventDetails(
        uint256 eventId,
        string memory _newName,
        string memory _newDate,
        string memory _newTime,
        string memory _newVenue,
        string memory _newDescription,
        string memory _newPerformers,
        string memory _newOrganizer,
        uint256 _newPrice,
        string memory _imageCID
    ) public {
        require(eventId <= _eventIds.current(), "Invalid event ID");
        require(events[eventId].creator == msg.sender, "Not event creator");

        events[eventId].name = _newName;
        events[eventId].date = _newDate;
        events[eventId].time = _newTime;
        events[eventId].venue = _newVenue;
        events[eventId].description = _newDescription;
        events[eventId].performers = _newPerformers;
        events[eventId].organizer = _newOrganizer;
        events[eventId].ticketPrice = _newPrice;
        events[eventId].imageCID = _imageCID;

            emit EventDetailsUpdated(eventId, msg.sender);

    }

    function getEventDetails(uint256 eventId) public view returns (Event memory) {
        require(eventId <= _eventIds.current(), "Invalid event ID");
        return events[eventId];
    }

    function getTicketDetails(uint256 ticketId) public view returns (Ticket memory) {
        require(ticketId <= _ticketIds.current(), "Invalid ticket ID");
        return tickets[ticketId];
    }

    function getNumberOfEvents() public view returns (uint256) {
        return _eventIds.current();
    }

    function listTicketForResale(uint256 ticketId, uint256 resalePrice) public {
        require(ownerOf(ticketId) == msg.sender, "Not ticket owner");
        require(!tickets[ticketId].isAvailableForResale, "Ticket already listed for resale");
        require(tickets[ticketId].resaleCount < MAX_RESALE_COUNT, "Ticket resale limit reached");

        uint256 eventId = tickets[ticketId].eventId;
        uint256 originalPrice = events[eventId].ticketPrice;
        uint256 maxResalePrice = (originalPrice * MAX_RESALE_PERCENT) / 100;

        require(resalePrice <= maxResalePrice, "Resale price exceeds maximum allowed percentage of the original price");

        tickets[ticketId].price = resalePrice;
        tickets[ticketId].isAvailableForResale = true;

        emit TicketListedForResale(ticketId, resalePrice);

    }

    function delistTicketFromResale(uint256 ticketId) public {
        require(ownerOf(ticketId) == msg.sender, "Not ticket owner");
        require(tickets[ticketId].isAvailableForResale, "Ticket not listed for resale");

        tickets[ticketId].price = 0;
        tickets[ticketId].isAvailableForResale = false;
        emit TicketDelistedFromResale(ticketId);

    }

    function buyResaleTicket(uint256 ticketId) public payable {
        require(tickets[ticketId].isAvailableForResale, "Ticket not available for resale");
        require(msg.value == tickets[ticketId].price, "Incorrect payment amount");

        address oldOwner = ownerOf(ticketId);
        _transfer(oldOwner, msg.sender, ticketId);

        uint256 resaleFee = (msg.value * RESALE_FEE_PERCENT) / 100;
        uint256 oldOwnerPayment = msg.value - resaleFee;

        payable(oldOwner).sendValue(oldOwnerPayment);
        payable(owner()).sendValue(resaleFee);

        tickets[ticketId].price = 0;
        tickets[ticketId].resaleCount++;
        tickets[ticketId].isAvailableForResale = false;

        emit TicketResold(ticketId, oldOwner, msg.sender, msg.value);
    }

    function getResaleTicketPrice(uint256 ticketId) public view returns (uint256) {
        require(tickets[ticketId].isAvailableForResale, "Ticket not available for resale");
        return tickets[ticketId].price;
    }

    function isTicketAvailableForResale(uint256 ticketId) public view returns (bool) {
        return tickets[ticketId].isAvailableForResale;
    }

    function getTotalTickets() public view returns (uint256) {
        return _ticketIds.current();
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).sendValue(balance);
    }
}