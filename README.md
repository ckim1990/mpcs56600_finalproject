MPCS 56600 BLOCKCHAIN: FINAL PROJECT
Group members: Claire Kim, Regina Widjaya, Xiaohan Kong, Blaze O'Byrne, Andrew Janiszewski
Date: 8/16/2018

Summary: This final project creates and implements an Ethereum-based, distributed application (dApp) for travel insurance. This application aims to simplify and decentralize travel insurance through the use of Ethereum smart contracts, while making travel insurance more transparent for all parties involved by using a public ledger and set of rules.

***************************

TravelInsurance.sol: Solidity code for both the TrustedProvider and TravelInsurance contracts.

TrustedProvider is instantiated by the insurance company and acts as a single, centralized repository of the Ethereum addresses of medical providers it's partnered with and who it "trusts" to make claims against its travel insurance policies.

TravelInsurance contracts reference the TrustedProvider contract and are a contract between the insurance company and customers who want to buy travel insurance. After the customer selects a policy and sends the value of the premium, the insurance company deposits the value of the coverage to validate the contract.

To make a claim against the contract, a medical provider makes a call to the TrustedProvider contract, referencing the address of the TravelInsurance contract against which it's claiming. If the medical provider's address is validated, TrustedProvider makes a call to the individual TravelInsurance contract and payment to the provider is sent immediately.

***************************
