import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import ignitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
import ignition from "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-verify";


/** @type {import('hardhat/config').HardhatUserConfig} */
export default {
  solidity: "0.8.20",
  plugins: [ignitionEthers, ignition],
  networks: {
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};