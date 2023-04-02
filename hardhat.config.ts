import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import 'hardhat-deploy';

import './tasks'

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
    },
    bnbtest: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: [''],
    },
  },
  etherscan: {
    apiKey: ''
  }
};

export default config;
