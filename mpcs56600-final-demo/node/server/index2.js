const express = require('express');
const helmet = require('helmet');
const Web3 = require('web3');
const path    = require("path");
const bodyParser = require('body-parser')

const deployer = require('../deploy2.js')


var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'spy liquid tone recycle maid athlete seat erase deer hamster era depth';
var rinkeby_api = 'https://rinkeby.infura.io/v3/0f9c46c5f9bb44a8b47447b7de7fe90a';

const provider = new HDWalletProvider(mnemonic,  rinkeby_api);
const web3 = new Web3(provider);

const Patient_Add = '0x97b78D55c61Dd230c22be88c28eDa5DE9d13E77A'; //CHANGE THIS TOMORROW!!
const Patient_Name =  'Patient_1';


//const contractAddress = "0xf557657558a15c4d2a7bF1Ab9083f401234B75Be";
const contractAbi = [{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_provider",
				"type": "address"
			},
			{
				"components": [
					{
						"name": "erVisitCoverage",
						"type": "bool"
					},
					{
						"name": "prescriptionCoverage",
						"type": "bool"
					},
					{
						"name": "surgeryCoverage",
						"type": "bool"
					}
				],
				"indexed": true,
				"name": "_validatedPolicy",
				"type": "tuple"
			},
			{
				"indexed": false,
				"name": "_amountDisbursed",
				"type": "uint256"
			}
		],
		"name": "claimProcessed",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_claimAmount",
				"type": "uint256"
			},
			{
				"name": "_providerAddress",
				"type": "address"
			}
		],
		"name": "claimFunds",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bloodType",
				"type": "string"
			},
			{
				"name": "_allergies",
				"type": "string"
			},
			{
				"name": "_conditions",
				"type": "string"
			},
			{
				"name": "_emergencyPhNum",
				"type": "uint256"
			},
			{
				"name": "_homeCountry",
				"type": "string"
			}
		],
		"name": "provideEmergencyInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_startDateTime",
				"type": "uint256"
			},
			{
				"name": "_endDateTime",
				"type": "uint256"
			},
			{
				"name": "_erVisitCoverage",
				"type": "bool"
			},
			{
				"name": "_prescriptionCoverage",
				"type": "bool"
			},
			{
				"name": "_surgeryCoverage",
				"type": "bool"
			}
		],
		"name": "selectNewPolicy",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "validate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_insurer",
				"type": "address"
			},
			{
				"components": [
					{
						"name": "erVisitCoverage",
						"type": "bool"
					},
					{
						"name": "prescriptionCoverage",
						"type": "bool"
					},
					{
						"name": "surgeryCoverage",
						"type": "bool"
					}
				],
				"indexed": true,
				"name": "_validatedPolicy",
				"type": "tuple"
			},
			{
				"indexed": false,
				"name": "_coverageValue",
				"type": "uint256"
			}
		],
		"name": "contractValidated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_insured",
				"type": "address"
			},
			{
				"components": [
					{
						"name": "erVisitCoverage",
						"type": "bool"
					},
					{
						"name": "prescriptionCoverage",
						"type": "bool"
					},
					{
						"name": "surgeryCoverage",
						"type": "bool"
					}
				],
				"indexed": true,
				"name": "_proposedPolicy",
				"type": "tuple"
			},
			{
				"indexed": false,
				"name": "_premiumValue",
				"type": "uint256"
			}
		],
		"name": "contractProposed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"name": "_trustedProviderContract",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "insurancePolicy",
		"outputs": [
			{
				"name": "erVisitCoverage",
				"type": "bool"
			},
			{
				"name": "prescriptionCoverage",
				"type": "bool"
			},
			{
				"name": "surgeryCoverage",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "insured",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxPayout",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "premiumAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// Web deployment using express
// Source: https://codeforgeek.com/2015/01/render-html-file-expressjs/
const app = express();
const port = process.env.PORT || 8801;
app.use(helmet());

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/patient.html'));
});

// Source: https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
app.post('/createInsurance', (req, res) => {
	var erCover = get_cover(req.body.ercover);
  var prescriptCover = get_cover(req.body.prescriptcover);
  var surgeryCover = get_cover(req.body.surgerycover);

  var startDate = new Date(req.body.startdate).getTime()/1000;
  var endDate = new Date(req.body.enddate).getTime()/1000;

  create_new_policy(startDate, endDate, erCover, prescriptCover, surgeryCover);

	res.end('Your Request has been submitted! Thank you!');

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


function create_new_policy(startDateTime, endDateTime, erVisitCoverage, prescriptionCoverage, surgeryCoverage) {
  deployer.deployContract().then(function(result) {
    var insContract = new web3.eth.Contract(contractAbi, result);
    //console.log(insContract)
    insContract.methods.selectNewPolicy(startDateTime, endDateTime, erVisitCoverage, prescriptionCoverage, surgeryCoverage)
      .send({
          from: process.env.RINKEBY_ADDRESS,
          gas: web3.utils.toHex(4000000),
          gasPrice: web3.utils.toHex(20000000000)
        }, function(error, transactionHash){
            if (error) {
              console.log(error)
            }
            else if (transactionHash) {
              console.log('newInsurance_TxH:'+transactionHash)
            }
        });
    });
};

function get_cover(isCovered) {
  return (isCovered!==1 ? true : false);
}
