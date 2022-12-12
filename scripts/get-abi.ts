import fs from "fs"
import path from "path"

export const extractABI = (name: string) => {
	const dir = path.resolve(
		__dirname,
		`../artifacts/contracts/${name}.sol/${name}.json`
	)
	const file = fs.readFileSync(dir, "utf8")
	const json = JSON.parse(file)
	const abi = json.abi
	return JSON.stringify(abi)
}

console.log('✅ Extracted ABI')
const ABI = extractABI('Game')
console.log(ABI)