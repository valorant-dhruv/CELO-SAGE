const Web3=require("web3");

async function fetchdata()
{
    let web3=await new Web3('https://sepolia.infura.io/v3/7e90726fdbe147c6a16825248e72eb2f');

    //This is the data that is present at slot-0 which is the bool value
    let data0=await web3.eth.getStorageAt("0xc90bfaE60b6B9f62B78aae0e3C6d218d88ABA944",0);
    console.log(data0);

    //This is the data that is present at slot-1 which is the bytes32 password value
    let data1=await web3.eth.getStorageAt("0xc90bfaE60b6B9f62B78aae0e3C6d218d88ABA944",1);
    console.log(data1);
}

fetchdata();