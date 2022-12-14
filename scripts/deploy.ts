import { ethers, run } from "hardhat";
import { sleep } from "../test/utils";

async function main() {
	const Game = await ethers.getContractFactory("Game");
	const linkSubId = 2831;
	const linkCoordinator = "0xAE975071Be8F8eE67addBC1A82488F1C24858067";
	const hashKey = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
	const ChainlinkRandomizer = await ethers.getContractFactory("ChainlinkRandomizer")
	const randomizer = await ChainlinkRandomizer.deploy(
		linkSubId,
        linkCoordinator,
        hashKey,
	);

	const contract = await Game.deploy(randomizer.address);
	await contract.deployed();
	console.log(`✅ Deployed contract ${contract.address}`);
	await sleep(30 * 1000)

	await run("verify:verify", {
		address: randomizer.address,
		constructorArguments: [linkSubId, linkCoordinator, hashKey],
	})

	await run("verify:verify", {
		address: contract.address,
		constructorArguments: [randomizer.address],
	})
	console.log(`✅ Contract verified`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
