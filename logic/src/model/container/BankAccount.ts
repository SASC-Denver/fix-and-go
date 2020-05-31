import {Purse} from './Purse'

export class BankAccount
	extends Purse {

	maximumCapacity = Number.MAX_SAFE_INTEGER

	allToPurse(
		purse: Purse
	): void {
		const coinsToTransfer = this.coins
		this.coins            = 0
		this.coins = purse.add(coinsToTransfer)
	}

	allFromPurse(
		purse: Purse
	): void {
		const coinsToTransfer = purse.coins
		purse.coins           = 0
		purse.coins = this.add(coinsToTransfer)
	}

}
