pragma solidity >=0.5.0 <0.6.0;

contract SupportERC20 {
    function transfer(address erc20, address recipient, uint256 amount) public onlyOwner {
        erc20.transfer(to, value);
    }

    function approve(address spender, uint256 value) public onlyOwner {
        erc20.approve(spender, value);
    }
}
