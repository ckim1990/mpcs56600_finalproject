// Import all required packages and scripts
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');

var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'spy liquid tone recycle maid athlete seat erase deer hamster era depth';
var rinkeby_api = 'https://rinkeby.infura.io/v3/0f9c46c5f9bb44a8b47447b7de7fe90a';

// Using Truffle HDWallet and Metamask Account Vault
const provider = new HDWalletProvider(mnemonic,  rinkeby_api);
const web3 = new Web3(provider);

var TrustedProviders_Add = '0x97b78D55c61Dd230c22be88c28eDa5DE9d13E77A';
var TrustedProviders_Name = 'Hospital_1';

deployContract_TP();

function deployContract_TP() {
  web3.eth.getTransactionCount(process.env.RINKEBY_ADDRESS).then((txnCount) => {
    console.log("txn count", txnCount);
    const source = fs.readFileSync(__dirname+'/contracts/TravelInsurance.sol');
    const compiled = solc.compile(source.toString(), 1);
    const abiDefinition_TP = JSON.parse(compiled.contracts[':TrustedProviders'].interface);
    const bytecode_TP = compiled.contracts[':TrustedProviders'].bytecode;

    const TrustedContract = new web3.eth.Contract(abiDefinition_TP);
    const tpContract = TrustedContract.deploy({
                arguments: [TrustedProviders_Add, TrustedProviders_Name],
                data: '0x' + bytecode_TP})
            .send({
                from: process.env.RINKEBY_ADDRESS,
                gas: web3.utils.toHex(4000000),
                gasPrice: web3.utils.toHex(20000000000)
            }, function(error, transactionHash){
                  console.log('TrustedProviders_Txh:' + transactionHash)
            })
            .on('receipt', function(receipt){
              console.log('TrustedProviders_Cth:' + receipt.contractAddress);
              process.exit()
            });

    console.log("TrustedProviders contract deploying...");
  });
};
