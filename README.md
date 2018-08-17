## MPCS 56600 BLOCKCHAIN: FINAL PROJECT
Group members: Claire Kim, Regina Widjaya, Xiaohan Kong, Blaze O'Byrne, Andrew Janiszewski
Date: 8/16/2018

Summary: This final project creates and implements an Ethereum-based, distributed application (dApp) for travel insurance. This application aims to simplify and decentralize travel insurance through the use of Ethereum smart contracts, while making travel insurance more transparent for all parties involved by using a public ledger and set of rules.

***************************

### TravelInsurance.sol

Solidity code for both the TrustedProvider and TravelInsurance contracts. A copy of this contract is also available in the demo contracts folder.

TrustedProvider is instantiated by the insurance company and acts as a single, centralized repository of the Ethereum addresses of medical providers it's partnered with and who it "trusts" to make claims against its travel insurance policies.

TravelInsurance contracts reference the TrustedProvider contract and are a contract between the insurance company and customers who want to buy travel insurance. After the customer selects a policy and sends the value of the premium, the insurance company deposits the value of the coverage to validate the contract.

To make a claim against the contract, a medical provider makes a call to the TrustedProvider contract, referencing the address of the TravelInsurance contract against which it's claiming. If the medical provider's address is validated, TrustedProvider makes a call to the individual TravelInsurance contract and payment to the provider is sent immediately.

***************************

### mpcs56600-final-demo

Demo on client-facing web app that deploys and interact Ethereum contract and blockchain network. This particular demo is focusing in the beginning of contract (insurance policy) creation where potential policy holders selects the type of policies that they are interested in, as well as the duration of the policy.


After all dependencies are installed. To run web app, in the mpcs56600-final-demo/node/server/ folder run the following:
```
node index.js
```
Then go to _localhost:8801_ to access the web app.

After contract creation and transaction process, user will be given a thank you message with their ethereum insurance contract address. Details on transaction can be searched and viewed in the [Rinkeby Etherscan](https://rinkeby.etherscan.io/) website.

_Caveats/To Do:_
  * In real application, travel insurance contract is deployed by the insurance company (owner address), while additional information submitted by user is a transaction prompted from the user address. Metamask ideally would allows creation and signing of multiple accounts (address) that we can use for testing. However, this functionality of metamask is said to have incompability issue with web3v1.0.0beta. Therefore in this particular example, we are using truffle HD Wallet which allow us to utilize one (1) address for testing purposes. We included the different address that _SHOULD_ be used as trasaction actors, but this is not what's being deployed.
  * Profiles should be changed to code deployer's own addresses/test address. all profiles are located in the ./node/server/profile.js file.

**Packages Used:**
  * _Web3.js (V1.0.0beta27)_: JS Library that communicates with the Ethereum/Blockchain.
  * _Infura.io (RINKEBY TestNet)_: Hosted Ethereum node cluster. Allow access to an ETH node without having to download the whole blockchain network.
  * _Metamask_: MetaMask provides a secure identity vault. It provides a user interface to manage your identities on different sites and sign blockchain transactions.
  * _Truffle-HDWallet_: Wallet enabled web3 provider. Sign transactions for addresses derived from a 12-word mnemonic. Currently only take one address.
  * _Express.js_: Web App framework based in javaScript for client facing interface.

**Files (mpcs56600-final-demo/):**
  * _node/_
    * _deploy1.js_ : Deploys TrustedProvider Contract (Manual)
    * _deploy2.js_ : Deploys TravelInsurance Contract
    * _server/_
      * _index.js_ : Web app server code that triggers the creation of new insurance contract
      * _patient.html_ : Client (patient/policy buyers) facing simple interface hmtl
      * _profiles.js_ : Profile data files that contains owner, user, and trusted providers address. _contents should be changed to code testers own addresses/test address to run._
    * _contracts/_
      * _TravelInsurace.sol_ : Solidity (smart contract) code for both the TrustedProvider and TravelInsurance contracts.
      * _contractABI.js_ : TravelInsurace contract ABI (Application Binary Interface)


***************************

References: specific references are provided within code.
