pragma solidity >=0.5.0 <0.6.0;

interface IPortfolioManager {

  function transferFunds(bytes32 key, address beneficiary, uint value) external;

  function lend(bytes32 key, bytes32 opportunityKey, address opportunity, uint value, bool subtract) external;

  function withdraw(bytes32 key, bytes32 opportunityKey, address opportunity, uint value, bool add) external;

  function setApprovalForAll(address token, address to, bool approved) external;

}
