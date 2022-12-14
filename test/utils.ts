import { ChainlinkRandomizer, Game } from "../typechain-types";
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
import VRF_COORDINATOR_ABI from "@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json"
import LINK_TOKEN_ABI from "@chainlink/contracts/abi/v0.4/LinkToken.json"

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

export const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

export const getInfo = async (game: Game, callback: GetInfoCallback) => callback({
	current: await game.currentRound(),
	last: await game.lastRound(),
	stats: await game.stats(),
})

export const getPlayer = async (address: string, game: Game, callback: GetPlayerCallback) => callback(await game.players(address))

export const playForWin = async (
	account: SignerWithAddress,
	game: Game,
	randomizer: any,
	coordinator: any,
) => {
	const { isWin } = await tryWinning(2, account, game, randomizer, coordinator)
	await expect(isWin).to.be.true
}

export const playForLoss = async (
	account: SignerWithAddress,
	game: Game,
	randomizer: any,
	coordinator: any,
) => {
	const { isWin } = await tryWinning(1, account, game, randomizer, coordinator)
	await expect(isWin).to.be.false
}

export const tryWinning = async (
	bet: number,
	account: SignerWithAddress,
	game: Game,
	randomizer: any,
	coordinator: any,
) => {
	let rollId: BigNumber = BigNumber.from("0")
	let isWin = false
	let result = 0
	const captureRollId = (value: any) => {
		rollId = value
		return true
	}
	const captureWin = (value: any) => {
		isWin = value
		return true
	}
	const captureRes = (value: any) => {
		//console.log('Die roll: ', value.toString(), '(expected ' + bet + ')')
		result = value	
		return true
	}
	const capture = (_: any) => {
		return true
	}
	await expect(play(bet, game, account)).to.emit(game, 'RollStarted').withArgs(captureRollId)
	await expect(coordinator.fulfillRandomWords(rollId, randomizer.address))
		.to.emit(game, 'GameEnded').withArgs(account.address, captureWin, capture, captureRes)
	return { isWin, result }
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

const deployRealRandomizer = async (
	subId: BigNumber,
	coordinatorAddress: string,
	hash: string
) => {
	const RandomizerFactory = await ethers.getContractFactory("ChainlinkRandomizer")
	return await RandomizerFactory.deploy(
		subId,
		coordinatorAddress,
		hash,
	)
}

const deployFakeRandomizer = async (
	subId: BigNumber,
	coordinatorAddress: string,
	hash: string
) => {
	const ChainlinkRandomizerMock = await ethers.getContractFactory("ChainlinkRandomizerMock")
	return await ChainlinkRandomizerMock.deploy(
		subId,
        coordinatorAddress,
        hash,
	)
}

type DeployConfig = {
	realRandomizer?: boolean;
}
export const deploy = async (config?: DeployConfig) => {
	const [owner, otherAccount] = await ethers.getSigners();

	const network = networkConfig.default

	// Deploy fake Chainlink Coordinator
	const BASE_FEE = "100000000000000000"
	const GAS_PRICE_LINK = "1000000000" // 0.000000001 LINK per gas
	const MockCoordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock")
	const coordinator = await MockCoordinatorFactory.deploy(BASE_FEE, GAS_PRICE_LINK)
	const vrfCoordinatorAddress = coordinator.address

	// Fund fake subscription
	const subscriptionId = ethers.BigNumber.from("1")
	await coordinator.createSubscription()
	await coordinator.fundSubscription(subscriptionId, network.fundAmount)

	// Deploy randomizer
	const randomizerCreator = config?.realRandomizer
		? deployRealRandomizer
		: deployFakeRandomizer
	const randomizer = await randomizerCreator(
		subscriptionId,
		vrfCoordinatorAddress,
		network['keyHash'],
	)

	// Initialize contract
	const Game = await ethers.getContractFactory("Game")
	const game = await Game.deploy(randomizer.address)
	
	// Authorize randomizer to talk only to game
	await randomizer.setGame(game.address)
	
	// Add consumer
	await coordinator.addConsumer(subscriptionId, randomizer.address)

	return { game, coordinator, randomizer, owner, otherAccount }
}

export const deployStaging = async () => {
	const [owner] = await ethers.getSigners()

	const network = networkConfig[80001]
	const subId = BigNumber.from(network["subscriptionId"])

	// Retrieve existing coordinator
	const coordinatorAddress = network["vrfCoordinator"]
	const coordinator = new ethers.Contract(
		coordinatorAddress,
		VRF_COORDINATOR_ABI,
		owner
	)

	// Deploy randomizer
	const randomizer = await deployRealRandomizer(
		subId,
		coordinatorAddress,
		network["keyHash"]
	)

	// Initialize contract
	const Game = await ethers.getContractFactory("Game")
	const game = await Game.deploy(randomizer.address)
	
	// Authorize randomizer to talk only to game
	await randomizer.setGame(game.address)
	console.log('A')
	
	console.log('B')

	// Add consumer
	await coordinator.addConsumer(subId, randomizer.address)
	console.log('C')

	return { game, coordinator, randomizer, owner }
}