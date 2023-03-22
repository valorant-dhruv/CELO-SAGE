require("@nomicfoundation/hardhat-toolbox");
const { hdkey } = require('ethereumjs-wallet');
const fs = require("fs");

const defaultNetwork="sepolia";

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `npx hardhat generate` and then `npx hardhat account`."
      );
    }
  }
  return "";
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.7.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  networks:{
    sepolia: {
      url: "https://sepolia.infura.io/v3/7e90726fdbe147c6a16825248e72eb2f",
      accounts: {
        mnemonic: mnemonic(),
      },
      allowUnlimitedContractSize:true
    }
  },
  
};

task(
  "generate",
  "Create a mnemonic for builder deploys",
  async (_, { ethers }) => {
    const bip39 = require("bip39");
    const mnemonic = bip39.generateMnemonic();
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
  }
);

task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const bip39 = require("bip39");
    const mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet.privateKey.toString("hex");
    const EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");

    const provider = new ethers.providers.JsonRpcProvider(
      config.networks.sepolia.url
    );
    const balance = await provider.getBalance(address);
    console.log('This is the account:',address)
    console.log("This is the balance: " + ethers.utils.formatEther(balance));
  }
);
