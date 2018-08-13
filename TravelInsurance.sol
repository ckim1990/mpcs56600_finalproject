pragma solidity ^0.4.0;

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

    struct MedicalInformation{
        string bloodType;
        string allergies;
        string conditions;
        uint emergencyPhNum;
        string homeCountry;
    }

    struct PolicyDetails{
        bool erVisitCoverage;
        bool prescriptionCoverage;
        bool surgeryCoverage;
    }

    event contractProposed(
        address indexed _insured,
        PolicyDetails indexed _proposedPolicy,
        uint _premiumValue
        );

    event contractValidated(
        address indexed _insurer
        PolicyDetails indexed _validatedPolicy,
        uint _coverageValue
        )

    constructor() public {
        // initial constructor called by insurance company
        owner = msg.sender;

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

        // require that funds send match required premium
        require(msg.value == calcPolicyPremium(insurancePolicy));

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
        emit contractValidated(msg.sender, insurancePolicy, msg.value)
    }

    // function to calculate insurance premium based on selected insurance type parameters
    function calcPolicyPremium(PolicyDetails _insurancePolicy) internal view returns (uint){

        // premium calculated as $5 per day * trip duration * a multiplier that
        // depends on the type of insurance purchased (I just made this up)

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

        uint policyDuration = endDateTime - startDateTime;
        premium = (policyDuration * 5) * multiplier;

        return premium;
    }

    // function used to calculate maximum payout based on selected insurance policy parameters
    function calcPolicyPayout(PolicyDetails _insurancePolicy) internal pure returns (uint){
        uint payout = 0;

        if(_insurancePolicy.erVisitCoverage == true){
            payout += 5000;
        }

        if(_insurancePolicy.prescriptionCoverage == true){
            payout += 1000;
        }

        if(_insurancePolicy.surgeryCoverage == true){
            payout += 10000;
        }

        return payout;
    }






}
