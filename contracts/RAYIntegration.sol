pragma solidity >=0.5.0 <0.6.0;

// TODO: RAY is written in solidity 0.4, we are using 0.5 is it a problem?
import "./interfaces/IPortfolioManager.sol";
import "./interfaces/IRAYToken.sol";
import "./interfaces/INAVCalculator.sol";
import "./interfaces/IRAY.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RAYIntegration {
    IRAY public RAY;
    IPortfolioManager public PortfolioManager;
    INAVCalculator public NAVCalculator;
    IRAYToken public RAYToken;

    function configureRAY(
        address _ray,
        address _portfolioManager,
        address _navCalculator,
        address _rayToken
    ) internal {
        RAY = IRAY(_ray);
        PortfolioManager = IPortfolioManager(_portfolioManager);
        NAVCalculator = INAVCalculator(_navCalculator);
        RAYToken = IRAYToken(_rayToken);
    }

    function genPortfolioId(string memory portfolioDescription) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(portfolioDescription));
    }

    function mint(
        address investedTokenAddress,
        bytes32 portfolioId,
        address beneficiary,
        uint value
    ) internal returns (bytes32) {
        ERC20(investedTokenAddress).approve(address(PortfolioManager), value);
        bytes32 rayTokenId = RAY.mint(portfolioId, beneficiary, value);
        return rayTokenId;
    }

    function deposit(
        address investedTokenAddress,
        bytes32 rayTokenId,
        uint value
    ) internal returns (bytes32) {
        ERC20(investedTokenAddress).approve(address(PortfolioManager), value);
        RAY.deposit(rayTokenId, 100);
        return rayTokenId;
    }

    function redeem(bytes32 rayTokenId, uint valueToWithdraw) internal returns (uint256) {
        uint256 valueAfterFee = RAY.redeem(
            rayTokenId,
            valueToWithdraw,
            address(this)
        );
        return valueAfterFee;
    }

    function burn(uint256 rayTokenId) internal {
        // rayTokenId is bytes32 but this function requires uint256 - TODO: ask Devon
        RAYToken.safeTransferFrom(address(this), address(PortfolioManager), rayTokenId);
    }
}
