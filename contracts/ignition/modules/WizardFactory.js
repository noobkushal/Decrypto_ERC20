import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WizardFactoryModule = buildModule("WizardFactoryModule", (m) => {
  const wizardFactory = m.contract("WizardFactory");

  return { wizardFactory };
});

export default WizardFactoryModule;
