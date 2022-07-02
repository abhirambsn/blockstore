require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.14",
  networks: {
    mumbai: {
      url: "https://speedy-nodes-nyc.moralis.io/74b7c3697a9d626fbb8d1ece/polygon/mumbai",
      accounts: ["46cdc15a3333c34eb5406268322e2d0ccf487795de7ef33303e80d047f18e884"]
    },
    avax: {
      url: "https://speedy-nodes-nyc.moralis.io/74b7c3697a9d626fbb8d1ece/avalanche/testnet",
      accounts: ["46cdc15a3333c34eb5406268322e2d0ccf487795de7ef33303e80d047f18e884"]
    },
    goerli: {
      url: "https://speedy-nodes-nyc.moralis.io/74b7c3697a9d626fbb8d1ece/eth/goerli",
      accounts: ["46cdc15a3333c34eb5406268322e2d0ccf487795de7ef33303e80d047f18e884"]
    }
  }
};
