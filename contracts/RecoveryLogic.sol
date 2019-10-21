pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract RecoveryLogic is Ownable {
    uint256 public lastAction;
    uint256 public recoveryDeadline;
    address[] public recoveryWallets;

    // recoveryWallet => asset address => percentage | 1 ETH = 100%
    mapping(address => mapping(address => uint256)) public recoverySheet;

    modifier updateAction() {
        lastAction = now;
        _;
    }

    modifier ifRecoverable() {
        require(isRecoverable(), "Contract is not recoveralbe");
        _;
    }

//Percentages value varies from 0 to 10000. So 55.05 is represented by 5505.
    function setRecoverySheet(
        address asset,
        address[] memory wallets,
        uint256[] memory values,
        uint256 deadline
    ) public onlyOwner updateAction {
        require(asset != address(0), "Asset cannot be zero address");
        require(deadline > 0, "Deadline must be bigger than zero");

        require(wallets.length == values.length && wallets.length > 0, "Length incorrect. Data corrupted");
        uint valuesTotalAmmount = 0;
        for (uint256 i = 0; i < wallets.length; i++) {
            require(wallets[i] != address(0), "Recovery wallet cannot be zero address");
            require(values[i] > 0 && values[i] <= 10000, "Percentage must be bigger then 0 smaller then 10000(100%)");
             
            recoverySheet[wallets[i]][asset] = values[i];
            valuesTotalAmmount += values[i]; 
        }
        require(valuesTotalAmmount == 10000, "Sum of all the percentages is not 10000(100%)");
        recoveryDeadline = deadline;
        recoveryWallets = wallets;
    }

    function isRecoverable() public view returns (bool) {
        return (lastAction + recoveryDeadline) >= now;
    }

    function recover() public ifRecoverable returns (bool) {
        // implement recovery logic
        return true;
    }

    function getRecoveryWallets() public view returns (address[] memory) {
        return recoveryWallets;
    }
}
