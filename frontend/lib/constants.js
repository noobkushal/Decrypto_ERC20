export const WIZARD_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_WIZARD_FACTORY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const WIZARD_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "founder", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "address[]", "name": "vestingAddresses", "type": "address[]" },
      { "indexed": false, "internalType": "string", "name": "tokenName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "tokenSymbol", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "startTimestamp", "type": "uint64" },
      { "indexed": false, "internalType": "uint64", "name": "cliffSeconds", "type": "uint64" },

      { "indexed": false, "internalType": "uint64", "name": "durationSeconds", "type": "uint64" }
    ],
    "name": "WizardDeployed",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "internalType": "address[]", "name": "beneficiaries", "type": "address[]" },
      { "internalType": "uint256[]", "name": "weights", "type": "uint256[]" },
      { "internalType": "uint64", "name": "cliffSeconds", "type": "uint64" },
      { "internalType": "uint64", "name": "durationSeconds", "type": "uint64" }
    ],
    "name": "deployWizard",
    "outputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "address[]", "name": "vestings", "type": "address[]" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
