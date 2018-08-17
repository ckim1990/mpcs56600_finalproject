// Import all required packages and scripts
// Source: https://medium.com/coinmonks/the-many-ways-to-deploy-your-smart-contract-to-rinkeby-network-38cadf7b20be
// Source: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');

// Using Truffle HDWallet and Metamask Account Vault
var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'spy liquid tone recycle maid athlete seat erase deer hamster era depth';
var rinkeby_api = 'https://rinkeby.infura.io/v3/0f9c46c5f9bb44a8b47447b7de7fe90a';

const provider = new HDWalletProvider(mnemonic,  rinkeby_api);
const web3 = new Web3(provider);


const TrustedProviders_CtH = '0xe2e00141498E0e15EF0905874Ea8a350A63A19F6'; //CHANGE TO GENERATED TRUSTED PROVIDER CONTRACT ADDRESS

//deployContract();
function deployContract() {
    return new Promise((resolve, reject) => {
      web3.eth.getTransactionCount(process.env.RINKEBY_ADDRESS).then((txnCount) => {
        console.log("txn count", txnCount);
        const source = fs.readFileSync(__dirname+'/contracts/TravelInsurance.sol');
        const compiled = solc.compile(source.toString(), 1);

        const abiDefinition_TI = JSON.parse(compiled.contracts[':TravelInsurance'].interface)
        const bytecode_TI = compiled.contracts[':TravelInsurance'].bytecode
        const InsuranceContract = new web3.eth.Contract(abiDefinition_TI)
        InsuranceContract.deploy({arguments:[TrustedProviders_CtH], data: '0x'+bytecode_TI})
            .send({
                from: process.env.RINKEBY_ADDRESS,
                gas: web3.utils.toHex(4000000),
                gasPrice: web3.utils.toHex(20000000000)
              }, function(error, transactionHash){
                  if (error) {
                    console.log(error)
                  }
                  else if (transactionHash) {
                    console.log('TravelInsurance_TxH:'+transactionHash)
                  }
              })
            .on('receipt', function(receipt){
                console.log('TravelInsurance_Cth:' + receipt.contractAddress);
                resolve(receipt.contractAddress)
              });
        });
      });
      console.log("TravelInsurance contract deploying...");
    };

module.exports = {deployContract : deployContract};
