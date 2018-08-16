module.exports.contractABI = [{
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
