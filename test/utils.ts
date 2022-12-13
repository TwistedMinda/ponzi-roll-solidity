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
import { expect } from "chai";

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

export const playForWin = async (account: SignerWithAddress, game: Game, coordinator: any) => {
	return false
}

export const playForLoss = async (account: SignerWithAddress, game: Game, coordinator: any) => {
	return false
}

export const tryWinning = async (
	bet: number,
	account: SignerWithAddress,
	game: Game,
	randomizer: any,
	coordinator: any,
) => {
	let rollId: BigNumber = BigNumber.from("0")
	const captureRollId = (value: any) => {
		rollId = value
		console.log('yo')
		return true
	}
	await expect(play(6, game, account)).to.emit(game, 'RollStarted').withArgs(captureRollId)
	await expect(coordinator.fulfillRandomWords(rollId, randomizer.address))
		.to.emit(game, 'GameEnded')
}

export const play = async (
	bet: number,
	game: Game,
	account: SignerWithAddress,
	amount = GAME_PRICE
) => game.connect(account).play(bet, {
	from: account.address,
	value: amount,
});

export const claim = (game: Game, account: SignerWithAddress) => game.connect(account).claim({
	from: account.address,
});

export const deploy = async () => {
	const [owner, otherAccount] = await ethers.getSigners();

	const chainId = 31337
	const network = networkConfig['default']

	// Deploy fake Chainlink Coordinator
	const BASE_FEE = "100000"
	const GAS_PRICE_LINK = "1000000" // 0.000000001 LINK per gas
	const VRFCoordinatorV2MockFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock")
	const VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(BASE_FEE, GAS_PRICE_LINK)
	const vrfCoordinatorAddress = VRFCoordinatorV2Mock.address

	// Create fake subscription
	const fundAmount = "100000000000000000000000"
	const transaction = await VRFCoordinatorV2Mock.createSubscription()
	const transactionReceipt = await transaction.wait(1)
	const topic = transactionReceipt.events
		? transactionReceipt.events[0].topics[1]
		: '0'
	const subscriptionId = ethers.BigNumber.from(topic)
	await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount)

	// Initilize randomizer
	const keyHash = network["keyHash"]
	const ChainlinkRandomizer = await ethers.getContractFactory("ChainlinkRandomizer")
	const randomizer = await ChainlinkRandomizer.deploy(
		subscriptionId,
        vrfCoordinatorAddress,
        keyHash,
	);
	
	// Initialize contract
	const Game = await ethers.getContractFactory("Game")
	const game = await Game.deploy(randomizer.address)
	
	// Authorize randomizer to talk only to game
	randomizer.setGame(game.address)

	// Wait full deployment
    await game.deployTransaction.wait(1)

	// Add consumer
	await VRFCoordinatorV2Mock.addConsumer(subscriptionId, randomizer.address)

	return { game, VRFCoordinatorV2Mock, randomizer, owner, otherAccount }
}

export const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))
