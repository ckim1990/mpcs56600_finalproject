pragma solidity ^0.4.0;

contract TravelInsurance {

    address public insured;
    MedicalInformation emergencyInfo;
    uint public premiumAmount;
    PolicyDetails public insurancePolicy;
    uint public maxPayout;
    uint startDateTime;
    uint endDateTime;

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

    constructor() public {
        // initial constructor called by insurance company
        owner = msg.sender;

        // set insurance parameters (defaults to no coverage)
        insurancePolicy = PolicyDetails(false, false, false);
    }

    function selectNewPolicy(uint _startDateTime, uint _endDateTime, bool _erVisitCoverage, bool _prescriptionCoverage, bool _surgeryCoverage) public {
        insured = msg.sender;
        startDateTime = _startDateTime;
        endDateTime = _endDateTime;
        insurancePolicy.erVisitCoverage = _erVisitCoverage;
        insurancePolicy.prescriptionCoverage = _prescriptionCoverage;
        insurancePolicy.surgeryCoverage = _surgeryCoverage;
    }

    function provideEmergencyInfo(string _bloodType, string _allergies, string _conditions, uint _emergencyPhNum, string _homeCountry) public {
        require(msg.sender == insured);
        emergencyInfo.bloodType = _bloodType;
        emergencyInfo.allergies = _allergies;
        emergencyInfo.conditions = _conditions;
        emergencyInfo.emergencyPhNum = _emergencyPhNum;
        emergencyInfo.homeCountry = _homeCountry;
    }

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

    function validate() public {

    }





}
