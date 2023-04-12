//This is the js file to deploy the UserContract smart contract
//For that we are using the ContractFactory class of the ethers.js library

import {ContractFactory, ethers,Contract} from "ethers";

//Now we import the abi and the bytecode of the smart contract
import {UsercontractABI,UsercontractBytecode,Usercontractaddress} from "./constants.js";
import Usercontract from "./Usercontract.json";
import { createUsercontractinstance } from "./instances.js";

//Also we import the signer
// import GetSignerorProvider from "./SignerorProvider";

//Now we create an instance of the smart contract
export default async function Createinstance(contentid,merkleroot,signer,useraddress,todeploy)
{

    console.log('Ok wow the create instance function is being called');
    var contract;

    //Update this if condition
    //For that we use the concept of redux so that we maintain a global state of all the addresses that are assigned true
    //Other than redux we can also use the concept of context API
    if(!todeploy)
    {
        console.log('We dont need to redeploy the smart contract and hence just creating the instance');
        //In this case we are just creating an instance of the smart contract so that it can be returned for interaction
        let instance=createUsercontractinstance(Usercontract.abi,Usercontractaddress,signer);
        return instance;
    }
    else{
        console.log("The factory is being generated");
        let factory = new ContractFactory(UsercontractABI, UsercontractBytecode, signer)
        console.log("Factory generated");

        // Deploy an instance of the contract
        console.log("The contract is being deployed");
        contract = await factory.deploy(contentid,merkleroot);


        //We basically wait for the transaction to be validated and added to the blockchain
        await contract.deployTransaction.wait();
        Usercontractaddress=contract.address;
    
        console.log(contract.address,"This is the address of the deployed smart contract");

        const ownerTx = await contract.transferOwnership(useraddress);

         console.log("\n       confirming...\n");
         const ownershipResult = await ownerTx.wait();
         if (ownershipResult) {
            console.log("       ✅ ownership transferred successfully!\n");
            }

        return contract;
    }

    //Here is the logic which checks whether the smart contract has been already deployed or not
    // let signer=await GetSignerorProvider(true);
    // The factory we use for deploying contracts
}

