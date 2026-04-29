import hre from "hardhat";

async function main() {
  console.log("Starting Ignition deployment...");
  try {
    const result = await hre.ignition.deploy(
      (await import("../ignition/modules/WizardFactory.js")).default,
      {
        networkName: "sepolia"
      }
    );
    console.log("Deployment successful!");
    console.log("WizardFactory deployed to:", result.wizardFactory.address);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main();
