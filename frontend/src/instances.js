//This is the javascript file where we will be creating the instances of the smart contract
//Basically we have two smart contracts available with us which are: Signing and Usercontract

//Firstly we import the class of the ethers.js library
import {Contract} from "ethers";
import Usercontract from "./Usercontract.json";

//Now from the constants js file we import the 

export async function createSigninginstance(ABI,contractaddress,providerorSigner)
{
    //In case we are calling read only functions inside the smart contract then we create the instance using the provider
    //If we are changing the state of the smart contract then we create the instance using the signer
    let instance=await new Contract(ABI,contractaddress,providerorSigner);
    return instance;
}

export async function createUsercontractinstance(ABI,contractaddress,providerorSigner)
{
    console.log("Okay the instance is being created");
    let instance=await new Contract(contractaddress,ABI,providerorSigner);
    console.log("The instance is created");
    return instance;
}

