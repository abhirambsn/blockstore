const hre = require("hardhat");

async function main() {
  const EscrowFactory = await hre.ethers.getContractFactory("Escrow");
  const escrow = await EscrowFactory.deploy();
  await escrow.deployed();
  console.log("Escrow Deployed to:", escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
