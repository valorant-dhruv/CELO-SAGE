//This is the jsx file where we will be making use of the account that is connected
import { useAccount, useSigner } from "wagmi";
import { useContext } from "react";
import Context from "./Context";
import Createinstance from "./deployusercontract";
export default function UseAccount()
{
    const {address,isConnecting,isDisconnected} =useAccount();
    
   
    let { walletaddress, setwalletaddress } = useContext(Context);
    if(isConnecting)
    {
       return <div class="walletstatus" style={{ color: 'white', fontSize: '1.2em' }}>Connecting</div>
    }

    if(isDisconnected)
    {
        return <div class="walletstatus" style={{ color: 'white', fontSize: '1.2em' }}>Not connected</div>
    }

    console.log("Is the use account component working");
    setwalletaddress(address);
    
    return <div class="walletstatus" style={{ color: 'white', fontSize: '1.2em' }}>
        {address}

        </div>
}