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
        '0xd2cda00d4286df9326d9af59340537b96d5c33647df341645d771690d6a2fe06',
        '0x44ce127b4d8c9688bdb3a843a867a7081310ca9e510090214e6eac9d235f6dad',
        '0x8a93fc0a2b737e4bd3456633a9f1a7f7eecc0440a379ce23e9e2836d32f96f5a',
        '0xbd473872367a50c0fbba1aad342144a1dafdfd2037731218a728c31d8ac12c2c',
        '0x5f45dab15e7f5154dce7dcc1c0762737086a4a9e6f7547c7b1f16aff9858e9a4'
      ]
    },
  },
};

export default config;
