const {ethers}=require("hardhat");


async function attach()
{
    const uniswapPoolFactory = new ethers.ContractFactory(contractPool.abi, contractPool.evm.bytecode, owner);
    const uniswapPoolAddress=0x367EAe886062c779a99E31E195413cf8Be2CbA53;
    const uniswapPool = await uniswapPoolFactory.attach(uniswapPoolAddress);
    const sqrtPriceX96 = ethers.BigNumber.from('3037000499');

    console.log("This is the sqrtPriceX96",sqrtPriceX96);
    await uniswapPool.initialize(sqrtPriceX96);
    console.log("Pool initialized!");

    console.log("This is the UniswapV3Pool contract address:",uniswapPool.address);

}