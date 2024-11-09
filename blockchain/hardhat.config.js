require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    telosTestnet: {
      url: "https://testnet.telos.net/evm",
      accounts: [`3a4d8c6d4e4fc2bdbe0f66e12fd15f64736b2a8c829a1dfc28c944aeb0d8f344`],
    },
  },
};
// 0x${YOUR_PRIVATE_KEY}