pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract RecoveryLogic is Initializable, Ownable {
    address[] public dcWalletsList;

    mapping(address => uint256) public lastAction;
    mapping(address => uint256) public recoveryDeadline;
    mapping(address => address[]) public recoveryWallets;

    // wallet => recoveryWallet => asset address => percentage | 1 ETH = 100%
    mapping(address => mapping(address => mapping(address => uint256))) public recoverySheet;

    event NewRecoverySheet(address user, address asset, address[] wallets, uint256[] values, uint256 deadline);

    modifier updateAction(address wallet) {
        lastAction[wallet] = now;
        _;
    }

    modifier ifRecoverable(address wallet) {
        require(isRecoverable(wallet), "#RecoveryLogic ifRecoverable() modifier: Contract is not recoverable");
        _;
    }

    function init(address owner) public initializer {
        _transferOwnership(owner);
    }

    /**
     * @dev Allows to recoverySheet state.
     * @param asset The address of token that will be used as Asset.
     * @param wallets The array of addresses to whom the asset will be sent.
     * @param values The array of percentages that corresponds to each wallets share. 1 ether = 100%.
     * @param deadline The number of seconds from the current moment (lastAction) the Asset will be sent to wallets.
     */
    function setRecoverySheet(
        address asset,
        address[] memory wallets,
        uint256[] memory values,
        uint256 deadline
    ) public updateAction(msg.sender) onlyOwner {
        require(asset != address(0), "#RecoveryLogic setRecoverySheet(): Asset cannot be zero address");
        require(deadline > 0, "#RecoveryLogic setRecoverySheet(): Deadline must be bigger than zero");
        require(wallets.length == values.length && wallets.length > 0, "#RecoveryLogic setRecoverySheet(): Length incorrect. Data corrupted");
        uint valuesTotalAmount = 0;
        for (uint256 i = 0; i < wallets.length; i++) {
            require(wallets[i] != address(0), "#RecoveryLogic setRecoverySheet(): Recovery wallet cannot be zero address");
            require(values[i] <= 1 ether, "#RecoveryLogic setRecoverySheet(): Percentage must be smaller then 1 ether(100%)");
            recoverySheet[msg.sender][wallets[i]][asset] = values[i];
            valuesTotalAmount += values[i];
        }
        require(valuesTotalAmount == 1 ether, "#RecoveryLogic setRecoverySheet(): Sum of all the percentages is not 1 ether(100%)");
        recoveryDeadline[msg.sender] = deadline;
        recoveryWallets[msg.sender] = wallets;
        emit NewRecoverySheet(msg.sender, asset, wallets, values, deadline);
        dcWalletsList.push(msg.sender);
    }

    /// @dev extend the deadline for recovery
    function alive() public updateAction(msg.sender) returns (bool) {
        return true;
    }

    function isRecoverable(address wallet) public view returns (bool) {
        return (lastAction[wallet] + recoveryDeadline[wallet]) <= now;
    }

    function getRecoveryWallets(address wallet) public view returns (address[] memory) {
        return recoveryWallets[wallet];
    }
}
