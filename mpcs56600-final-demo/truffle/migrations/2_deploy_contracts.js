var TrustedProviders = artifacts.require('./TrustedProviders.sol')
var TravelInsurance = artifacts.require('./TravelInsurance.sol')



module.exports = function (deployer) {
  deployer.deploy(TrustedProviders).then(function(){
	console.log (TrustedProviders.address)
	return deployer.deploy(TravelInsurance, TrustedProviders.address)});
};
