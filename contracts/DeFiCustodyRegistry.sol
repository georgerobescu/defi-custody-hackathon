pragma solidity >=0.5.0 <0.6.0;


import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./DCWallet.sol";
import "./RAYIntegration.sol";
import "./RecoveryLogic.sol";


contract DeFiCustodyRegistry is Initializable, Ownable, DCWallet, RAYIntegration, RecoveryLogic {

    address[] private tokens;

    event NewWallet(address indexed proxy, address admin, address sender);
    event NewSupportedToken(address indexed token, address sender);
    event RecoveredERC20(
        address indexed wallet,
        address indexed principalAddress,
        address indexed beneficiary,
        uint share,
        uint value);

    function init(address _rayStorage, address owner) public initializer {
        RAYIntegration.init(_rayStorage);
        RecoveryLogic.init(owner);
    }

    function getTokens() external view returns(address[] memory) {
        return tokens;
    }

    function addSupportedToken(address token) external onlyOwner returns(bool) {
        for (uint i = 0; i < tokens.length; i++) {
            require(tokens[i]!= token, "#DeFiCustodyRegistry addSupportedToken(): Token was already added.");
        }
        tokens.push(token);
        emit NewSupportedToken(token, msg.sender);
        return true;
    }

    function recoverRAY(bytes32 rayTokenId) external ifRecoverable(rayTokens[rayTokenId]) {
        address payable beneficiary;
        uint share;
        uint value;
        bytes32 portfolioId;
        uint valueAfterFee;

        address wallet = rayTokens[rayTokenId];
        uint valueToWithdraw = getTokenValue(rayTokenId);
        (portfolioId, valueAfterFee) = redeem(rayTokenId, valueToWithdraw, address(this));
        address principalAddress = rayStorage.getPrincipalAddress(portfolioId);

        for (uint i = 0; i < recoveryWallets[wallet].length; i++) {
            beneficiary = address(uint160(recoveryWallets[wallet][i]));
            share = recoverySheet[wallet][beneficiary][principalAddress];
            value = valueAfterFee.mul(share).div(1 ether);

            if (rayStorage.getIsERC20(principalAddress)) {
                require(IERC20(principalAddress).transfer(beneficiary, value),
                    "#DeFiCustodyRegistry recoverRAY(): Transfer of ERC20 token failed");
            }
            emit RecoveredERC20(wallet, principalAddress, beneficiary, share, value);
        }
    }

    function recoverERC20(address wallet, address asset) external ifRecoverable(wallet) {
        address payable beneficiary;
        uint share;
        uint value;

        for (uint i = 0; i < recoveryWallets[wallet].length; i++) {
            beneficiary = address(uint160(recoveryWallets[wallet][i]));
            share = recoverySheet[wallet][beneficiary][asset];
            value = balances[asset][wallet].mul(share).div(1 ether);
            beneficiary.transfer(value);
            emit RecoveredERC20(wallet, asset, beneficiary, share, value);
        }
    }

    
}
