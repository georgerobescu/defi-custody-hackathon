pragma solidity >=0.5.0 <0.6.0;


import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./AdminUpgradeabilityProxy.sol";
import "./RBAC.sol";


contract DeFiCustodyRegistry is Initializable, RBAC {

    string public constant OWNER = "owner";

    address[] private tokens;
    AdminUpgradeabilityProxy[] private wallets;
    address public implementation;

    event ImplementationUpdate(address indexed oldImpl, address indexed newImpl);
    event NewWallet(address indexed proxy, address admin, address sender);
    event NewSupportedToken(address indexed token, address sender);

    function init(address _owner, address _implementation) external initializer {
        addRole(_owner, OWNER);
        implementation = _implementation;
    }

    function setImplementation(address _implementation) external onlyRole(OWNER) {
        emit ImplementationUpdate(implementation, _implementation);
        implementation = _implementation;
    }

    function createWalletProxy(address _admin, bytes memory _data) public returns (address) {
        AdminUpgradeabilityProxy proxy =
            new AdminUpgradeabilityProxy(implementation, _admin, _data);
        emit NewWallet(address(proxy), _admin, msg.sender);
        wallets.push(proxy);
        return address(proxy);
    }

    function addSupportedToken(address token) external onlyRole(OWNER) returns(bool) {
        for (uint i = 0; i < tokens.length; i++) {
            require(tokens[i]!= token, "Token was already added.");
        }
        tokens.push(token);
        emit NewSupportedToken(token, msg.sender);
        return true;
    }

    function getTokens() external view returns(address[] memory) {
        return tokens;
    }

    function getWallets() external view returns(AdminUpgradeabilityProxy[] memory) {
        return wallets;
    }
}
