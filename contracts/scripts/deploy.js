import hre from "hardhat";
const { ethers, network } = hre;

async function main() {
  console.log("--- ⚡ VILLAIN DEPLOYMENT INITIALIZED ⚡ ---");

  // Force-wait for the connection
  const connection = await network.connect();

  if (!ethers || !ethers.deployContract) {
    throw new Error("Hardhat failed to inject ethers. Please check hardhat.config.js imports.");
  }

  console.log(`Connected to: ${connection.networkName}`);
  console.log("Deploying WizardFactory...");

  const factory = await ethers.deployContract("WizardFactory");

  console.log("Transaction sent! Waiting for block confirmation...");
  await factory.waitForDeployment();

  const address = await factory.getAddress();

  console.log("\n===============================================");
  console.log(`🚀 SUCCESS: WizardFactory deployed to: ${address}`);
  console.log("===============================================\n");
}

main().catch((error) => {
  console.error("\n❌ DEPLOYMENT FAILED:");
  console.error(error);
  process.exit(1);
});