import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x310b0032d95b5ddd2df1a5167dfb3d6bc3a5a1f3c4389967e5f6ee22b22081c9',
        '0xb378d130687d16c9f084c98092221bbeebabdeb179dbc2954f15f6d1e4533bc2',
        '0x6903490830676297d9e2ae67c9ebbfb674af8d5fcd5241bbcc5f40937fdc4ba1',
        '0x21cb50d1017351151386dbddca27f5b0eae0b60935e91588e5751ad2c1f37ec7',
        '0x8982700e30d6a34814dbbd7f0b270599b434735694a4408591450961021a1f78'
      ]
    },
  },
};

export default config;
