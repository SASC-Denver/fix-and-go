import {Purse} from './Purse'

export class BankAccount
	extends Purse {

	maximumCapacity = Number.MAX_SAFE_INTEGER

	allToPurse(
		purse: Purse
	): void {
		const coinsToTransfer = this.state.coins
		this.state.coins            = 0
		this.state.coins = purse.add(coinsToTransfer)
	}

	allFromPurse(
		purse: Purse
	): void {
		const coinsToTransfer = purse.state.coins
		purse.state.coins           = 0
		purse.state.coins = this.add(coinsToTransfer)
	}

}
