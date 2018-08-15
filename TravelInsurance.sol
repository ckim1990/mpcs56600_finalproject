/*
 * Final project for MPCS 56600 -- Intro to Blockchain
 * Group members: Xiaohan Kong, Regina Widjaya, Claire Kim, Blaze O'Byrne, Andrew Janiszewski
 *
 * Solidity contracts for both the TrustedProviders and TravelInsurance contract
 * types used to build our travel insurance project
 */

pragma solidity ^0.4.0;

// template for primary traveler insurance contract
contract TravelInsurance {

    // individual contract parameters
    address public insured;
    MedicalInformation emergencyInfo;
    uint public premiumAmount;
    PolicyDetails public insurancePolicy;
    uint public maxPayout;
    uint startDateTime;
    uint endDateTime;

    // owner is Insurance company
    address owner;

    // trusted providers registered in a separate contract
    address trustedProviders;

    // optional additional information
    struct MedicalInformation{
        string bloodType;
        string allergies;
        string conditions;
        uint emergencyPhNum;
        string homeCountry;
    }

    // policy parameters
    struct PolicyDetails{
        bool erVisitCoverage;
        bool prescriptionCoverage;
        bool surgeryCoverage;
    }

    // event recording for new contract
    event contractProposed(
        address indexed _insured,
        PolicyDetails indexed _proposedPolicy,
        uint _premiumValue
        );

    // event recording for validated contract
    event contractValidated(
        address indexed _insurer,
        PolicyDetails indexed _validatedPolicy,
        uint _coverageValue
        );

    // event recording for processed claim
    event claimProcessed(
        address indexed _provider,
        PolicyDetails indexed _validatedPolicy,
        uint _amountDisbursed
        );

    // event to record default fallback payment
    event fallbackPayment(
        address indexed _messageSender,
        uint _amount
        );
    // helpful post about events and emitting events:
    // https://medium.com/@aniketengg/emit-keyword-in-solidity-242a679b0e1a

    // initial constructor called by insurance company
    constructor(address _trustedProviderContract) public {
        owner = msg.sender;

        // set trusted contract
        trustedProviders = _trustedProviderContract;

        // set insurance parameters (defaults to no coverage)
        insurancePolicy = PolicyDetails(false, false, false);
    }

    // function for policy holder to set the travel policy they want and transfer premium
    function selectNewPolicy(uint _startDateTime, uint _endDateTime, bool _erVisitCoverage, bool _prescriptionCoverage, bool _surgeryCoverage) public payable {
        insured = msg.sender;
        startDateTime = _startDateTime;
        endDateTime = _endDateTime;
        insurancePolicy.erVisitCoverage = _erVisitCoverage;
        insurancePolicy.prescriptionCoverage = _prescriptionCoverage;
        insurancePolicy.surgeryCoverage = _surgeryCoverage;
        premiumAmount = calcPolicyPremium(insurancePolicy);

        // require that funds send match required premium
        require(msg.value >= calcPolicyPremium(insurancePolicy));

        // log details of proposed contract
        emit contractProposed(msg.sender, insurancePolicy, msg.value);
    }

    // function for policy holder to add emergency info that can be accessed by hospital
    function provideEmergencyInfo(string _bloodType, string _allergies, string _conditions, uint _emergencyPhNum, string _homeCountry) public {
        require(msg.sender == insured);
        emergencyInfo.bloodType = _bloodType;
        emergencyInfo.allergies = _allergies;
        emergencyInfo.conditions = _conditions;
        emergencyInfo.emergencyPhNum = _emergencyPhNum;
        emergencyInfo.homeCountry = _homeCountry;
    }

    // function for insurance company to validate policy and transfer payout funds
    function validate() public payable {
        // require that validator is insurance company and that sufficient funds are available to cover payout
        require(msg.sender == owner);
        require(msg.value == calcPolicyPayout(insurancePolicy));

        // log details of validated contract
        emit contractValidated(msg.sender, insurancePolicy, msg.value);
        maxPayout = calcPolicyPayout(insurancePolicy);
    }

    // function for medical provider to claim payment; must be called via TrustedProviders contract
    function claimFunds(uint _claimAmount, address _providerAddress) public payable {
        require(msg.sender == trustedProviders);
        if(_claimAmount < maxPayout){
            if (now >= startDateTime && now <= endDateTime){
                _providerAddress.transfer(_claimAmount);
                emit claimProcessed(_providerAddress, insurancePolicy, _claimAmount);
            }
        }
    }

    // function to calculate insurance premium based on selected insurance type parameters
    function calcPolicyPremium(PolicyDetails _insurancePolicy) internal view returns (uint){

        // premium calculated as $2 per day * trip duration * a multiplier that
        // depends on the type of insurance purchased

        // set initial premium to 0
        uint premium = 0;
        uint multiplier = 1;

        // increment for each type of insurance selected
        if(_insurancePolicy.erVisitCoverage == true){
            multiplier += 1;
        }

        if(_insurancePolicy.prescriptionCoverage == true){
            multiplier += 1;
        }

        if(_insurancePolicy.surgeryCoverage == true){
            multiplier += 2;
        }

        // multiply daily rate by multiplier
        uint policyDuration = (endDateTime - startDateTime) / (60*60*24); // convert epoch time in seconds to days
        premium = (policyDuration * 5000000000000000) * multiplier; // 5*10^15 wei equivalent to about USD$2

        return premium;
    }

    // function used to calculate maximum payout based on selected insurance policy parameters
    function calcPolicyPayout(PolicyDetails _insurancePolicy) internal pure returns (uint){
        uint payout = 0;

        if(_insurancePolicy.erVisitCoverage == true){
            payout += (2500000000000000000 * 5); // approx USD$5000
        }

        if(_insurancePolicy.prescriptionCoverage == true){
            payout += 2500000000000000000; // approx USD$1000
        }

        if(_insurancePolicy.surgeryCoverage == true){
            payout += (2500000000000000000 * 10); // approx USD$10000
        }

        return payout;
    }

    // default fallback function
    function () external payable{
        emit fallbackPayment(msg.sender, msg.value);
    }
    // used this posting as a helpful guide for understanding Ethereum fallback functions:
    // https://ethereum.stackexchange.com/questions/7570/whats-a-fallback-function-when-using-address-send
}


// separate contract used to manage Insurance company trusted providers
contract TrustedProviders {

    // trusted provider addresses stored in mapping
    mapping (address => string) public trustedProviders;

    // contract owned by insurance company
    address owner;

    // constructor called by insurance company
    constructor(address _providerAddress, string _providerName) public{
        owner = msg.sender;
        trustedProviders[_providerAddress] = _providerName;
    }

    // function to add new provider to trusted list
    function addTrustedProvider(address _providerAddress, string _providerName) public {
        require(msg.sender == owner);
        trustedProviders[_providerAddress] = _providerName;
    }

    // function to remove trusted provider
    function removeTrustedProvider(address _providerAddress) public {
        require(msg.sender == owner);
        delete trustedProviders[_providerAddress];
    }

    // function used by a trusted provider to call an individual contract and claim payment
    function fileClaim(address _claimContract, uint _claimAmount) public {
        TravelInsurance claimContract = TravelInsurance(_claimContract);
        bytes memory testEmpty = bytes(trustedProviders[msg.sender]);
        if(testEmpty.length != 0){
            claimContract.claimFunds(_claimAmount, msg.sender);
        }
    }
    // used this post as a reference for how to check for entries/values in a mapping in Solidity:
    // https://ethereum.stackexchange.com/questions/13021/how-can-you-figure-out-if-a-certain-key-exists-in-a-mapping-struct-defined-insi
    // in addition to the Solidity docs, this post was helpful for calling another contract
    // from a contract: https://ethereum.stackexchange.com/questions/2826/call-function-on-another-contract
    // also used this post for some context around the ways to transfer funds:
    // https://ethereum.stackexchange.com/questions/19341/address-send-vs-address-transfer-best-practice-usage
}

// additional references include the Solidity docs: https://solidity.readthedocs.io/en/v0.4.24/
// also used two Ethereum/Solidity projects as general references for syntax and structure:
// https://github.com/AigangNetwork/aigang-forwarder
// https://github.com/etherisc/flightDelay
