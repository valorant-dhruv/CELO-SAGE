//This is the function that will be used for calling the functions inside the usercontract smart contract
import {usePrepareContractWrite,useContractWrite} from "wagmi";
import {BigNumber} from "ethers";
export default function Usercontractcall(props)
{
    let {callbackfn,address,abi,useraddress}=props;
    console.log("Now we are calling the getdata function from the smart contract");
    console.log(address);
    console.log(abi);
    console.log(useraddress);
    const { config } = usePrepareContractWrite({
        address,
        abi,
        functionName: 'getdata',
        args: [BigNumber.from("1")],
      })
      const { data, isLoading, isSuccess,write } = useContractWrite(config);

      async function geteventdata()
      {
          let receipt=await data.wait();
          console.log(receipt.logs);
          

          //Now that we have the logs of data available with us
          
      }
      

    //   if(isLoading)
    //   {
    //       //This means that the data fetching is still in the loading phase and hence call the function to indicate that its
    //       //still loading
    //       console.log('The data is being fetched');
    //       callbackfn("Data being fetched");
    //   }

    //   if(isError)
    //   {
    //       console.log("Some error occured while fetching the data");
    //       callbackfn("Error occured");
    //   }
    
    //   if(isSuccess)
    //   {
    //       //Hence this means that the data is fetched successfully
    //       console.log("Finally it was a success in fetching the data");
    //       callbackfn(data);
    //   }

    //Now we will be using the hooks that are provided by wagmi to so the tasks 
    return(
        <div>
        <button disabled={!write} onClick={() => write?.()}>
          Feed
        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>
           {JSON.stringify(data)}
           <button onClick={geteventdata}> Get event data</button> 
        </div>}
      </div>
    )
}