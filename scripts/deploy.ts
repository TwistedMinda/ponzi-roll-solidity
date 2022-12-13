import { ethers, run } from "hardhat";

const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

async function main() {
	const Game = await ethers.getContractFactory("Game");
	const linkSubId = 2831;
	const linkCoordinator = "0xAE975071Be8F8eE67addBC1A82488F1C24858067";
	const hashKey = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
	const contract = await Game.deploy(
		linkSubId,
		linkCoordinator,
		hashKey
	);

	await contract.deployed();
	console.log(`✅ Deployed contract ${contract.address}`);
	await sleep(30 * 1000)
	await run("verify:verify", {
		address: contract.address,
		constructorArguments: [linkSubId, linkCoordinator, hashKey],
	})
	console.log(`✅ Contract verified`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
