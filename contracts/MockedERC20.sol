pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockedERC20 is ERC20 {
    string public _name = "Dai test";
    string public _symbol = "DAI";
    uint8 public _decimals = 2;

    constructor() public {
        _mint(msg.sender, 1 ether);
    }

    // Function to access name of token .
    function name() public view returns (string memory) {
        return _name;
    }
    // Function to access symbol of token .
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    // Function to access decimals of token .
    function decimals() public view returns (uint8) {
        return _decimals;
    }
}