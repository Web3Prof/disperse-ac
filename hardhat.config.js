/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const GOERLI_API_KEY = process.env.GOERLI_API_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    goerli: {
      url: GOERLI_API_KEY,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
