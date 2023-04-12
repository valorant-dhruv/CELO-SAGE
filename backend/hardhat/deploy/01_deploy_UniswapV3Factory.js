const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainid=await getChainId();
  // const address=await getUnnamedAccounts();
  console.log(deployer);

  await deploy("UniswapV3Factory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });

  const streamer = await ethers.getContract("Storeaccounts", deployer);
  console.log("The smart contract has been deployed");

  console.log("This is the address of the deployed smart contract",streamer.address);

  
};

module.exports.tags = ["Streamer"];