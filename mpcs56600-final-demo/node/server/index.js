// Project is inspired by:
// Source: https://medium.com/coinmonks/the-many-ways-to-deploy-your-smart-contract-to-rinkeby-network-38cadf7b20be
// Source: https://codex.happyfuncorp.com/ethereum-programming-for-web-developers-a-tutorial-9c83f35f531
// Source: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#

// Import all required packages and scripts
const express = require('express');
const helmet = require('helmet');
const Web3 = require('web3');
const path    = require("path");
const bodyParser = require('body-parser')

// Import local scripts and dependencies
const deployer = require('../deploy2.js') // TravelInsurace deployer function
const abi = require('../contracts/contractABI.js') // TravelInsurance contract abi (large)

// Using Truffle HDWallet and Metamask Account Vault
var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'spy liquid tone recycle maid athlete seat erase deer hamster era depth'; //mnemonic key to sign/unlock wallet transaction
var rinkeby_api = 'https://rinkeby.infura.io/v3/0f9c46c5f9bb44a8b47447b7de7fe90a'; //API URL from Infura.io to get access to a rinkeby node

// Instantiate Web3 method
const provider = new HDWalletProvider(mnemonic,  rinkeby_api);
const web3 = new Web3(provider);

//Placeholder Patient address and name, THIS IS NOT PASSED ANYWHERE
const Patient_Add ="0x2A8B5DF119489b538e3998e128F60F88865481e8";
const Patient_Name = 'Patient_1';

// Initialize var to hold generated insurance contract address
var contractHash = '0xDdc08Db5fD2A7F5D9Aa601938be73E2FAeA45fc3';

// Import TravelInsurance contract abi
const contractAbi = abi.contractABI

// Simple app deployment using express
// Source: https://codeforgeek.com/2015/01/render-html-file-expressjs/
const app = express();
const port = process.env.PORT || 8801;
app.use(helmet());

// Express modules to parse incoming JSON data from html post
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies

// Render client-facing interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/patient.html'));
});

// Take POST data to trigger contract creation and interract with created contract
// Source: https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
app.post('/createInsurance', async function(req, res, next) {
	var erCover = get_cover(req.body.ercover);
  var prescriptCover = get_cover(req.body.prescriptcover);
  var surgeryCover = get_cover(req.body.surgerycover);

  var startDate = new Date(req.body.startdate).getTime()/1000;
  var endDate = new Date(req.body.enddate).getTime()/1000;

	// Call function that creates new insurace contract and trigger createNewPolicy module (transactions) in the contract
  create_new_policy(startDate, endDate, erCover, prescriptCover, surgeryCover)
		.then(function (result) {
			res.end('Thank you for choosing our service! \n Your Policy Contract Address is: ' + result);
		})

});


// error handling: for now just console.log
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send('Something broke! '+ JSON.stringify(err));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});

// FUNCTION: Deploy contract and input transaction when prompted
function create_new_policy(startDateTime, endDateTime, erVisitCoverage, prescriptionCoverage, surgeryCoverage) {
	return new Promise((resolve, reject) => {
	  deployer.deployContract().then(function(result) {
	    var insContract = new web3.eth.Contract(contractAbi, result);
	    contractHash = result;
	    insContract.methods.selectNewPolicy(startDateTime, endDateTime, erVisitCoverage, prescriptionCoverage, surgeryCoverage)
	      .send({
	          from: process.env.RINKEBY_ADDRESS,
	          gas: web3.utils.toHex(4000000),
	          gasPrice: web3.utils.toHex(20000000000),
						value: 400000000000000000
	        }, function(error, transactionHash){
	            if (error) {
	              console.log(error)
	            }
	            else if (transactionHash) {
	              console.log('newInsurance_TxH:' + transactionHash)
								resolve(contractHash)
	            }
	        });
	    });
		});
}

// HELPER FUNCTION: To convert 1/0 input from the html to boolean
function get_cover(isCovered) {
  return (isCovered!==1 ? true : false);
}
