// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyERC20 is ERC20{
    mapping(address => bool) private claimedAirdropAccountList;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }
    function airdrop() public {
        require(claimedAirdropAccountList[msg.sender] == false, "This account has claimed airdrop already");
        _mint(msg.sender, 1000000);
        claimedAirdropAccountList[msg.sender] = true;
    }
    function isClaimed() public view returns(bool){
        return claimedAirdropAccountList[msg.sender];
    }
}
