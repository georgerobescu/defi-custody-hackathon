pragma solidity >=0.5.0 <0.6.0;

interface INAVCalculator {

  function updateYield(bytes32 key, uint yield) external;

  function getPortfolioPricePerShare(bytes32 key) external view returns(uint);

  function getPortfolioUnrealizedYield(bytes32 portfolioKey) external view returns (uint);

  function getOpportunityPricePerShare(bytes32 opportunityKey) external view returns (uint);

  function getOpportunityYield(
    bytes32 key,
    bytes32 opportunityKey,
    uint amountToWithdraw
  )
    external
    view
    returns (uint);

 function getOpportunityBalance(bytes32 key, bytes32 opportunityKey) external view returns(uint);

 function calculatePayableAmount(address principalAddress, uint value) external view returns(bool, uint);

 function onlyTokenOwner(bytes32 tokenId, address origCaller, address msgSender) external view returns (address);

 function getTokenValue(bytes32 key, bytes32 tokenId) external view returns (uint, uint);

}
