import { resolve } from "path";
import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
