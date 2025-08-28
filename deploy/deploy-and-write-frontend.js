import fs from "fs";
import path from "path";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", await deployer.getAddress());

  const Compliance = await ethers.getContractFactory("ComplianceRegistry");
  const compliance = await Compliance.deploy(await deployer.getAddress());
  await compliance.deployed();
  console.log("ComplianceRegistry:", compliance.address);

  const Factory = await ethers.getContractFactory("LoanFactory");
  const factory = await Factory.deploy(compliance.address);
  await factory.deployed();
  console.log("LoanFactory:", factory.address);

  // Write ABIs and addresses to frontend
  const frontendDir = path.join(__dirname, "..", "frontend", "src");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  const out = {
    ComplianceRegistry: {
      address: compliance.address,
      abi: JSON.parse(compliance.interface.format("json"))
    },
    LoanFactory: {
      address: factory.address,
      abi: JSON.parse(factory.interface.format("json"))
    }
  };

  fs.writeFileSync(
    path.join(frontendDir, "contracts.json"),
    JSON.stringify(out, null, 2)
  );

  console.log("Wrote frontend/src/contracts.json");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
