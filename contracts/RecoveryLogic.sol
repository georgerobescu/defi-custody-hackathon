pragma solidity >=0.5.0 <0.6.0;

contract RecoveryLogic {
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

    function setRecoverySheet(
        address asset,
        address[] memory wallets,
        uint256[] memory values,
        uint256 deadline
    ) public onlyOwner updateAction {
        require(wallets.length == values.length, "Length incorrect. Data corrupted");
        require(asset != address(0), "Asset cannot be zero address");

        for (uint256 i = 0; i < wallets.length; i++) {
            recoverySheet[wallets[i]][asset] = values[i];
        }
        recoveryDeadline = deadline;
    }

    function isRecoverable() public view returns (bool) {
        return (lastAction + deadline) >= now;
    }

    function recover() public ifRecoverable {
        // implement recovery logic
    }
}
