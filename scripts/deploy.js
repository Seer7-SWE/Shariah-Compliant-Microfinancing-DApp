async function main() {
  const LoanFactory = await ethers.getContractFactory("LoanFactory");
  const loanFactory = await LoanFactory.deploy();
  await loanFactory.waitForDeployment();
  console.log("LoanFactory deployed to:", await loanFactory.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
