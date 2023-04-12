//Now we import the evm compatible blockchains
import {goerli,celoAlfajores,polygonMumbai} from "wagmi/chains";
import { configureChains,createClient } from 'wagmi';
import {walletConnectProvider, modalConnectors,EthereumClient} from "@web3modal/ethereum";

//Now we create an array of these chains
const chains=[goerli,celoAlfajores,polygonMumbai];


//Get the projectId from the walletconnect cloud
//Inside that create a new project and enter the details
let walletproviders=[walletConnectProvider({ projectId: "db6f8aea7165a0906d6ceab802837cd9" })];


const {provider}=configureChains(chains,walletproviders);
console.log(provider);

//Now that we have the providers the next step is to create a client
//It can take a lot of parameters
//The first parameter is the autoConnect (optional) which Enables reconnecting to last used connector on mount. Defaults to false.
//The second parameter is the connectors.Connectors used for linking accounts. Defaults to [new InjectedConnector()].
//For the connectors we make use of the modalconnectors function of the @web3modal/ethereum
//The last parameter for our usage is the provider that we got from the configurechains
export const client = createClient({
    autoConnect:true,
    connectors: modalConnectors({
        projectId: "db6f8aea7165a0906d6ceab802837cd9",
        version: "1", // or "2"
        appName: "decentralized storage",
        chains,
      }),
    provider,
  })

export const ethereumClient=new EthereumClient(client,chains);

//Now we export both the ethereumclient and the client so that it can be used in our app



