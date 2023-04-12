// deploy/00_deploy_streamer.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainid=await getChainId();
  // const address=await getUnnamedAccounts();
  console.log(deployer);

  await deploy("Storeaccounts", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });

  const streamer = await ethers.getContract("Storeaccounts", deployer);
  console.log("The smart contract has been deployed");

  console.log("This is the address of the deployed smart contract",streamer.address);

  // Now that the smart contract has been deployed the next step is to transfer the ownership of the smart contract to the frontend
  // address
  // const frontendaddress="0xE27E8bE768b01070F4eb12523e8a52F8D682F1Fa";
  // const ownerTx = await streamer.transferOwnership(frontendaddress);

  // console.log("\n       confirming...\n");
  // const ownershipResult = await ownerTx.wait();
  // if (ownershipResult) {
  //   console.log("       ✅ ownership transferred successfully!\n");
  // }
  
};

module.exports.tags = ["Streamer"];