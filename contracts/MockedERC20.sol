pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockedERC20 is ERC20 {
    constructor(address user, uint amount) public {
        _mint(user, amount);
    }
}