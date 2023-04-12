import "./App.css";
import Walletconnect from "./Walletconnect.jsx";
import IPFSapp from "./IPFS";
import Context from "./Context";
import React, { useContext, setContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import {Web3Modal} from "@web3modal/react";
import { WagmiConfig } from "wagmi";

import {client,ethereumClient} from "./Walletconnect2";
import UseAccount from "./UseAccount";
function App() {
  let [walletaddress, setwalletaddress] = useState();
  let [web3, setweb3] = useState();

  let obj = { walletaddress, setwalletaddress, web3, setweb3 };
  return (
    <div>

<React.StrictMode>     
       <WagmiConfig client={client}>
      <Context.Provider value={obj}>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Walletconnect />} />
            {/* <Route exact path="/use" element={<UseAccount />} /> */}
            <Route exact path="/Generate" element={<IPFSapp />} />
          </Routes>
        </Router>
      </Context.Provider>
      </WagmiConfig>

      <Web3Modal
        projectId="db6f8aea7165a0906d6ceab802837cd9"
        ethereumClient={ethereumClient}
      />
     </React.StrictMode>

      {/* <Route path="/about" component={} />
      <Route path="/contact" component={Contact} /> */}
    </div>
  );
}

export default App;
