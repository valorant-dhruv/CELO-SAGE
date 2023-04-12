import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import axios from "axios";
import Context from "./Context";
import Web3 from "web3";
import { ethers } from "ethers";
import Createinstance from "./deployusercontract";
import Signing from "./Signing.json";
import {useSigner,useProvider,useSignMessage} from "wagmi";
import { verifyMessage } from 'ethers/lib/utils'
import { UsercontractABI, Usercontractaddress } from "./constants";
import Usercontract from "./Usercontract.json";
import Usercontractcall from "./CallUsercontract.js";
import './WalletConnect.css'

// import GetSignerorProvider from "./SignerorProvider";

export default function IPFSuploadfunction() {
  let signing = useRef();
  let signermain=useSigner();
  let provider=useProvider();
  // console.log(providermain,"This is the provider");
  // console.log(signermain,"This is the signer");
  // const { data, error, isLoading, signMessage } = useSignMessage({
  //   onSuccess(data, variables) {
  //     // Verify signature when sign message succeeds
  //     const address = verifyMessage(variables.message, data)
  //   },
  // })
  let signer=signermain.data;
  // let provider=providermain.data;
  // console.log("This is the signer that we got",signer);
  // console.log("This is the provider that we got",provider);


  let { walletaddress, setwalletaddress } = useContext(Context);
  const [file, setFile] = useState();
  const [web3, setweb3] = useState();
  const [loading,setloading]=useState(false);

  const [contractdata,setcontractdata]=useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };


  //This is the callback function that is being passed as a prop to the CallUsercontract component so that
  //When the data is fetched from the smart contract using the hooks we can transfer the data to the parent component
  async function callbackfn(data)
  {
    //When this function is called it means that the value has been fetched from the smart contract
    //For now lets just print a statement to indicate that yes the value has been fetched
    setcontractdata(data);


  }

  useEffect(() => {
    let _web3 = new Web3(
      "https://goerli.infura.io/v3/7e90726fdbe147c6a16825248e72eb2f"
    );
    console.log(typeof _web3.eth);


    //Now we also create an instance of the Signing smart contract
    async function createinstances() {
      // const provider = await new ethers.providers.Web3Provider(window.ethereum);
      // await provider.send("eth_requestAccounts", []);
      // const signer = await provider.getSigner();

      //This is the contract address deployed in the goerli testnet 0xFB295f887882beEC3FE11dEa259E59D237914A08
      signing.current = await new ethers.Contract(
        "0xac13a2209Dcc8968b9450BF107d5ebbE56F8E43f",
        Signing.abi,
        provider
      );

      console.log(
        signing.current,
        "This is the instance of the smart contract"
      );
    }

    createinstances();
    console.log("The instaces are created");
    setweb3(_web3);
  }, []);


  async function deploycontract(contentid,merkleroot)
  {

    //For sending whether we need to deploy a new contract or not
    //We need the variable that is present inside the constants.js file
    let todeploy;
    if(Usercontractaddress.toString()==="")
    {
      todeploy=true;
    } 

    else{
      todeploy=false;
    }
    console.log("Now we are deploying the smart contract");
    let contractinstance=await Createinstance(contentid,merkleroot,signer,walletaddress,todeploy);

    console.log("Finally we get the instance of the smart contract");
    setloading(true);
    // console.log("This is the instance of the smart contract",contractinstance);
    // // let ans=await contractinstance.getdata(ethers.BigNumber.from('1'));
    // let ans=await contractinstance._allowed();
    // console.log(ans,"This is the data that we got back from the Usercontract smart contract");

    //In any case whether the smart contract has been deployed or not deployed we get back an instance of the smart contract
  }

  async function handleSubmit(event,deploycontract) {
    await signTransaction();
    event.preventDefault()
    const url = 'http://localhost:5000/api/upload';
    const formData = new FormData();
    formData.append('dhruv', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    let result=await axios.post(url, formData, config).then((response) => {
      console.log(response.data);
      return response.data;
      //Now that we have the response the next step is to call the function
    }).catch(error=>
      {
        console.log(error);
      })

    console.log("This is the response from the backend");
    console.log(typeof  result.merkleroot);
    console.log(typeof result.contentid);
    await deploycontract(result.contentid,result.merkleroot);
  }




  async function signTransaction() {
    console.log("Yeah working on signing the transaction");

    // //Now as the login button has been clicked we will sign a message that  we received from the smart contract
    // //Let us assume this is the message

    let message =
      "I hereby declare that i am signing the given document";

    console.log("This is the message", message);

    // Now we need to get the hash from the message
    let hash = await signing.current.getMessageHash(message);

    console.log("This is the hash that we got from the smart contract");
    console.log(hash);

    let data = await window.ethereum.request({
      method: "personal_sign",
      params: [walletaddress,hash],
    });

    // let data=await signMessage(hash);

    console.log("This is the signature data:", data);

    let final = await signing.current.verify(walletaddress, message, data);
    console.log("After verifying the user the data that we got is:");
    console.log(final);

    const url = 'http://localhost:5000/api/transfer';
    const finaldata={
      results:final
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };

   
      axios.post(url,{ data: final,address:walletaddress },config).then(res=>
        {
          console.log(res);

          //Now that we have got the response the next step is the deploy the smart contract if the user hasn't deployed one
          //In case the user has already deployed a smart contract then in that case don't deploy another
          
        }).catch(error=>
          {
            console.log(error);
          })
  
      console.log('I have transferred the result to the backend');

    //Now the next step is to deploy the smart contract Usercontract so that it can be used by the owner of the account
    //For that we imported the signer of the smart contract as well as the function that deploys it 
    // let signer=await GetSignerorProvider(true);

    //Before creating an instance we also need to ensure that this account address doesn't have a contract already deployed
    //Also this is the function that will be called in case we receive the data from the backend

   


  }

  
  return (
    <div className="walletconnect">
      <input type="file" onChange={handleFileChange} style={{ backgroundColor: 'white', color: 'black', borderRadius: '10px', padding: '10px 20px', fontSize: '18px', fontWeight: 'bold', border: 'none', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', cursor: 'pointer' }} />


<button
  style={{
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '24px',
    background: '#2196F3',
    color: '#FFFFFF'
  }}
  onClick={(e) => {
    handleSubmit(e,deploycontract);
  }}
>
  Click to upload data
</button>

{loading && <Usercontractcall address={Usercontractaddress} callbackfn={callbackfn} abi={Usercontract.abi} useradress={walletaddress} />}

<p style={{ fontSize: '24px' }}>{contractdata}</p>

    </div>
  );
}
