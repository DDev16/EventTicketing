import Web3 from 'web3';
import EventTicketingABI from '../abi.json'; // Import ABI or define it as a constant

const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

let web3;
let contract;

if (window.ethereum) {
  // Use MetaMask provider if available
  web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch((error) => {
    console.error('Error enabling MetaMask:', error);
  });
} else {
  // Fallback to the local Ethereum node if MetaMask is not available
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  web3 = new Web3(provider);
}

contract = new web3.eth.Contract(EventTicketingABI, contractAddress);

export { web3, contract };
