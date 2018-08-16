const express = require('express');
const helmet = require('helmet');
const Web3 = require('web3');
const path    = require("path");
const bodyParser = require('body-parser')

const deployer = require('../deploy2.js')
const abi = require('./contractABI.js')


var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'spy liquid tone recycle maid athlete seat erase deer hamster era depth';
var rinkeby_api = 'https://rinkeby.infura.io/v3/0f9c46c5f9bb44a8b47447b7de7fe90a';

const provider = new HDWalletProvider(mnemonic,  rinkeby_api);
const web3 = new Web3(provider);

const Patient_Add = '0x2A8B5DF119489b538e3998e128F60F88865481e8'; //CHANGE THIS TOMORROW!!
const Patient_Name =  'Patient_1';

var contractHash = '0xDdc08Db5fD2A7F5D9Aa601938be73E2FAeA45fc3';

// Import TravelInsurance contract abi
const contractAbi = abi.contractABI

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
app.post('/createInsurance', async function(req, res, next) {
	var erCover = get_cover(req.body.ercover);
  var prescriptCover = get_cover(req.body.prescriptcover);
  var surgeryCover = get_cover(req.body.surgerycover);

  var startDate = new Date(req.body.startdate).getTime()/1000;
  var endDate = new Date(req.body.enddate).getTime()/1000;

  await create_new_policy(startDate, endDate, erCover, prescriptCover, surgeryCover);
	res.end('Thank you for choosing our service! \n Your Policy Contract Address is: ' + contractHash);

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
            }
        });
    });
};

function get_cover(isCovered) {
  return (isCovered!==1 ? true : false);
}
