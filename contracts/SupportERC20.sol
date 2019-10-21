pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract SupportERC20 is Ownable {
    IERC20 public erc20;

    function transfer(address recipient, uint256 amount) public onlyOwner {
        erc20.transfer(recipient, amount);
    }

    function approve(address spender, uint256 value) public onlyOwner {
        erc20.approve(spender, value);
    }
}
