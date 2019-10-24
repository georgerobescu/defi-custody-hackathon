pragma solidity >=0.5.0 <0.6.0;


/// @notice  Basic interface containing some useful functions for RAY integration.
///
/// Author:   Devan Purhar

interface IRAYStorage {

  /// @notice  Get the portfolioId associated with a RAY token
  function getTokenKey(bytes32 rayTokenId) external view returns (bytes32);


  /// @notice  Get the contract address of the underlying asset associated with a
  ///          portfolioId
  function getPrincipalAddress(bytes32 portfolioId) external view returns (address);


  /// @notice  Get if a contract address follows the ERC20 standard or not
  function getIsERC20(address principalAddress) external view returns (bool);


  /// @notice  Dynamically get the contract address of different RAY smart contracts
  ///
  /// @param   contractId - Each contract has an id represented by the result of
  ///                       a keccak256() of the contract name.
  ///
  ///                       Example: PortfolioManager.sol can be dynamically referenced
  ///                       by getContractAddress(keccak256('PortfolioManagerContract'));
  function getContractAddress(bytes32 contractId) external view returns (address);


  /// @notice  Get the shares owned by a RAY token
  function getTokenShares(bytes32 portfolioId, bytes32 rayTokenId) external view returns (uint);


  /// @notice  Get the capital credited to a RAY token
  function getTokenCapital(bytes32 portfolioId, bytes32 rayTokenId) external view returns (uint);


  /// @notice  Get the allowance credited to a RAY token - allowance decides what
  ///          amount of value will be charged a fee
  function getTokenAllowance(bytes32 portfolioId, bytes32 rayTokenId) external view returns (uint);

}
