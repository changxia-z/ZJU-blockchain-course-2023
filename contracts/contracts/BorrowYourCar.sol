// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./MyERC20.sol";
contract BorrowYourCar{

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);
    event CarRent(uint carTokenId, address owner);
    MyERC20 public myERC20;
    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }
    struct CarReturn {
        uint256 carTokenId;
        address owner;
        address borrower;
        uint256 borrowUntil;
    }
    mapping(uint256 => Car) public cars; // A map from car index to its information
    mapping(address => uint256[]) public myCars;
    uint256 private curCar;
    constructor(){
        curCar = 0;
        myERC20 = new MyERC20("JJCoin","JJC");
        // maybe you need a constructor
    }
    function borrowerOf(uint256 carTokenId) public view returns(address){
        if(isBorrowed(carTokenId)){
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
    function showAllCars() public view returns(CarReturn[] memory result){
        result = new CarReturn[](curCar);
        for(uint256 i = 1; i <= curCar; i++)
        {
            result[i - 1].carTokenId = i;
            result[i - 1].owner = cars[i].owner;
            result[i - 1].borrower = cars[i].borrower;
            result[i - 1].borrowUntil = cars[i].borrowUntil;
        }
    }
    function seeMyCars() public view returns(CarReturn[] memory){
        address owner = msg.sender;
        uint256[] memory Cars = myCars[owner];
        CarReturn[] memory result = new CarReturn[](Cars.length);
        for(uint256 i = 0; i < Cars.length; i++)
        {
            result[i].owner = cars[Cars[i]].owner;
            result[i].borrower = cars[Cars[i]].borrower;
            result[i].carTokenId = Cars[i];
            result[i].borrowUntil = cars[Cars[i]].borrowUntil;
        }
        return result;
    }
    function isOwner(address user, uint256 carTokenId) private view returns(bool) {
        address owner = ownerOf(carTokenId);
        return owner == user ? true : false;
    }
    function isBorrowed(uint256 carTokenId) private view returns(bool){
        return cars[carTokenId].borrowUntil >= block.timestamp ? true : false;
    }
    function borrow(uint256 carTokenId, uint256 duration) public payable {
        require((!isOwner(msg.sender,carTokenId) && !isBorrowed(carTokenId)));
        myERC20.transferFrom(msg.sender,cars[carTokenId].owner, duration);
        Car storage car = cars[carTokenId];
        car.borrower = msg.sender;
        car.borrowUntil = block.timestamp + duration;
        emit CarBorrowed(carTokenId, msg.sender, block.timestamp, duration);
    }
    function rent() public{
        address owner = msg.sender;
        Car storage carInfo = cars[++curCar];
        carInfo.owner = msg.sender;
        carInfo.borrower = address(0);
        carInfo.borrowUntil = 0;
        myCars[owner].push(curCar);
        console.log(msg.sender);
        emit CarRent(curCar, owner);
    }
}