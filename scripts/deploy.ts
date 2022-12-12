import { ethers, run } from "hardhat";

const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

async function main() {
	const Game = await ethers.getContractFactory("Game");
	const contract = await Game.deploy();

	await contract.deployed();
	console.log(`✅ Deployed contract ${contract.address}`);
	await sleep(15 * 1000)
	await run("verify:verify", {
		address: contract.address,
		constructorArguments: [],
	})
	console.log(`✅ Contract verified`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
