pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import '@openzeppelin/upgrades/contracts/utils/Address.sol';

contract SupportERC20 is Ownable {
    IERC20 public erc20;

    event TokenUpdate(IERC20 indexed oldImpl, IERC20 indexed newImpl);

    constructor (IERC20 _erc20) public {
        erc20 = _erc20;
    }

    function transfer(address recipient, uint256 amount) public onlyOwner {
        erc20.transfer(recipient, amount);
    }

    function approve(address spender, uint256 value) public onlyOwner {
        erc20.approve(spender, value);
    }

    function setERC20(IERC20 _erc20) public onlyOwner {
        require(OpenZeppelinUpgradesAddress.isContract(address(_erc20)), "Cannot set a ERC20 implementation to a non-contract address");
        emit TokenUpdate(erc20, _erc20);
        erc20 = _erc20;
    }
}
