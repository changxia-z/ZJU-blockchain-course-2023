import { ethers } from "hardhat";

async function main() {
  const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
  const borrowYourCar = await BorrowYourCar.deploy();
  await borrowYourCar.deployed();
  console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);
  const myERC20 = await borrowYourCar.myERC20();

  console.log(`MyERC20 deployed to ${myERC20}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});