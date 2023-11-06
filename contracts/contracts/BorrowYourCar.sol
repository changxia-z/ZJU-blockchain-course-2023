// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BorrowYourCar is ERC721{

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information
    mapping(address => uint256[]) public myCars;

    constructor() {
        myERC721 = new ERC721("cars", "CARS");
        // maybe you need a constructor
    }

    function borrowerOf(uint256 carTokenId) public view returns(address){
        if(!isBorrowed(carTokenId)){
            return cars[carTokenId].borrower;
        }
        else{
            return address(0);
        }
    }
    function ownerOf(uint256 carTokenId) public view returns(address owner){
        owner = cars[carTokenId].owner;
        require(owner != address(0));
    }
    function seeMyCars() public view returns(uint256[]){
        address owner = msg.sender;
        return myCars[owner];
    }
    function seeMyCarsFree() public view returns(uint256[]){
        address owner = msg.sender;
        uint256[] allCars = myCars[owner];
        uint256[] freeCars;
        for(uint i = 0; i < allCars.length; i++)
        {
            if(!isBorrowed(allCars[i])){
                freeCars.push(allCars[i]);
            }
        }
        return freeCars;
    }
    function isOwner(address user, uint256 carTokenId) private view returns(bool) {
        address owner = ownerOf(carTokenId);
        return owner == user ? true : false;
    }
    function isBorrowed(uint256 carTokenId) private returns(bool){
        return cars[carTokenId].borrowUntil >= block.timestamp ? true : false;
    }
    function borrow(uint256 carTokenId, uint256 duration) public {
        require(!isOwner(msg.sender) && !isBorrowed(carTokenId));
        Car storage car = cars[carTokenId];
        car.borrower = msg.sender;
        car.borrowUntil = block.timestamp + duration;
        emit CarBorrowed(carTokenId, msg.sender, block.timestamp, duration);
    }
    // ...
    // TODO add any logic if you want
}