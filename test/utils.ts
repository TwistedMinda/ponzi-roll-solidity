import { Game } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { ethers, network, run } from "hardhat";
import {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} from "./networks.config"
import { BigNumber } from "ethers";

type CurrentRound = Awaited<ReturnType<Game['currentRound']>>
type LastRound = Awaited<ReturnType<Game['lastRound']>>
type Stats = Awaited<ReturnType<Game['stats']>>
type PlayerState = Awaited<ReturnType<Game['players']>>

type Info = {
	current: CurrentRound,
	last: LastRound,
	stats: Stats,
}
type GetInfoCallback = (info: Info) => Promise<any> | any
type GetPlayerCallback = (player: PlayerState) => Promise<any> | any

export const ROUND_DURATION = 5 * 60
export const GAME_PRICE = parseEther("0.001")

export const getInfo = async (game: Game, callback: GetInfoCallback) => callback({
	current: await game.currentRound(),
	last: await game.lastRound(),
	stats: await game.stats(),
})

export const getPlayer = async (address: string, game: Game, callback: GetPlayerCallback) => callback(await game.players(address))

export const checkWin = async (game: Game, VRFCoordinatorV2Mock: any) => {
	return await new Promise(async (resolve, reject) => {
		
		game.once("GameEnded", (_: string, win: boolean, bet: BigNumber, result: BigNumber) => {
			console.log('g')
			resolve(win)
		})
		game.once("RollStarted", async (rollId: BigNumber) => {
			console.log('h')
			const trx = await VRFCoordinatorV2Mock.fulfillRandomWords(
				rollId,
				game.address,
			)
			const res = await trx.wait(4)
			for (const event of res.events) {
				console.log(`Event ${event.event} with args ${event.args}`);
			  }
		})
	})
}

export const play = async (
	bet: number,
	game: Game,
	account: SignerWithAddress,
	amount = GAME_PRICE
) => {
	await game.connect(account).play(bet, {
		from: account.address,
		value: amount,
	})
};

export const claim = (game: Game, account: SignerWithAddress) => game.connect(account).claim({
	from: account.address,
});

export const deploy = async () => {
	const [owner, otherAccount] = await ethers.getSigners();

	const chainId = 31337
	const network = networkConfig['default']

	// Create fake Chainlink Coordinatoor
	const BASE_FEE = "100000000000000000"
	const GAS_PRICE_LINK = "1000000000" // 0.000000001 LINK per gas
	const VRFCoordinatorV2MockFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock")
	const VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(BASE_FEE, GAS_PRICE_LINK)
	const vrfCoordinatorAddress = VRFCoordinatorV2Mock.address

	// Create fake subscription
	const fundAmount = network["fundAmount"] || "1000000000000000000"
	const transaction = await VRFCoordinatorV2Mock.createSubscription()
	const transactionReceipt = await transaction.wait(1)
	if (!transactionReceipt.events)
		return;
	const subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1])
	await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount)

	// Initialize contract
    const keyHash = network["keyHash"]
	const Game = await ethers.getContractFactory("Game");
	const game = await Game.deploy(
		subscriptionId,
        vrfCoordinatorAddress,
        keyHash,
	);

	// Wait full deployment
    await game.deployTransaction.wait(1)

	// Add consumer
	await VRFCoordinatorV2Mock.addConsumer(subscriptionId, game.address)

	return { game, VRFCoordinatorV2Mock, owner, otherAccount };
}