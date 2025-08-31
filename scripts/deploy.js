async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ComplianceRegistry first (or if already deployed, use that address)
  const ComplianceRegistry = await ethers.getContractFactory("ComplianceRegistry");
  const complianceRegistry = await ComplianceRegistry.deploy(deployer.address); // pass admin address here
  await complianceRegistry.waitForDeployment();
  console.log("ComplianceRegistry deployed to:", await complianceRegistry.getAddress());

  // Now deploy LoanFactory with ComplianceRegistry address
  const LoanFactory = await ethers.getContractFactory("LoanFactory");
  const loanFactory = await LoanFactory.deploy(await complianceRegistry.getAddress()); // pass constructor arg
  await loanFactory.waitForDeployment();
  console.log("LoanFactory deployed to:", await loanFactory.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
