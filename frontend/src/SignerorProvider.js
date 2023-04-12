//This is the js file that returns the signer or the provider of the account
import { useProvider,useSigner } from 'wagmi';

export default async function GetSignerorProvider(requiresigner=false)
{
    //This means that by default we need the provider
    console.log("The problem starts from here");
    let provider=await useProvider();
    let signer=await useSigner();
    console.log("This would have been printed if no error");

    if(!requiresigner)
    {
        return provider;
    }

    else{
        return signer;
    }

}