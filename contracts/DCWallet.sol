pragma solidity >=0.5.0 <0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DCWallet {
    using SafeMath for uint256;

    // ERC20 => wallet => amount
    mapping(address => mapping(address => uint256)) public balances;

    event DepositDC(address erc20, address from, uint256 amount);
    event WithdrawDC(address erc20, address from, uint256 amount);

    function depositDC(address erc20, address user, uint256 amount) external {
        IERC20(erc20).transferFrom(user, address(this), amount);
        balances[erc20][user] = balances[erc20][user].add(amount);
        emit DepositDC(erc20, user, amount);
    }

    function withdrawDC(address erc20, uint256 amount) external {
        balances[erc20][msg.sender] = balances[erc20][msg.sender].sub(amount);
        IERC20(erc20).transfer(msg.sender, amount);
        emit WithdrawDC(erc20, msg.sender, amount);
    }
}
