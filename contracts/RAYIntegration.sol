pragma solidity >=0.5.0 <0.6.0;

import "../interfaces/IPortfolioManager.sol";
import "../interfaces/IRAYToken.sol";

contract RAYIntegration {
    address public PortfolioManager;
    address public NAVCalculator;
    address public RAYToken;

    function configureRAY(
        address _portfolioManager,
        address _navCalculator,
        address _rayToken
    ) internal {
        PortfolioManager = IPortfolioManager(_portfolioManager);
        NAVCalculator = _navCalculator;
        RAYToken = IRAYToken(_rayToken);
    }

    function genPortfolioId(string memory portfolioDescription) public view returns (bytes32) {
        return keccak256(portfolioDescription);
    }

    function mint(
        address investedTokenAddress,
        bytes32 portfolioId,
        address beneficiary,
        uint value
    ) internal returns (bytes32) {
        ERC20(investedTokenAddress).approve(address(PortfolioManager), value);
        rayTokenId = PortfolioManager.mint(portfolioId, beneficiary, value);
        return rayTokenId;
    }

    function deposit(
        address investedTokenAddress,
        bytes32 rayTokenId,
        uint value
    ) internal returns (bytes32) {
        ERC20(investedTokenAddress).approve(address(PortfolioManager), value);
        rayTokenId = PortfolioManager.deposit(rayTokenId, 100);
        return rayTokenId;
    }

    function redeem(bytes32 rayTokenId, uint valueToWithdraw) internal returns (uint256) {
        uint256 valueAfterFee = PortfolioManager.redeem(
            rayTokenId,
            valueToWithdraw,
            address(this)
        );
        return valueAfterFee;
    }

    function burn(bytes32 rayTokenId) internal {
        RAYToken.safeTransferFrom(address(this), address(PortfolioManager), rayTokenId);
    }
}
