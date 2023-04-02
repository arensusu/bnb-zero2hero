// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract lpSusuToken is ERC20, Ownable {

    constructor() ERC20("lpSusuToken", "lpSST") {
        _mint(msg.sender, 1e18 * 1e9 ether);
    }

    function mint(uint256 _amount) external payable {
        require(msg.value * 1e18 == _amount);
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external {
        require(balanceOf(msg.sender) >= _amount);
        _burn(msg.sender, _amount);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}