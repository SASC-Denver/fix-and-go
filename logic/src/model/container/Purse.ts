import {IGameCharacterState} from '../GameCharacter'

export class Purse {

	maximumCapacity = 500000

	constructor(
		public state: IGameCharacterState
	) {
		if (!this.state.coins) {
			this.state.coins = 0
		}
	}

	add(
		someCoins: number
	): number {
		if (this.state.coins + someCoins > this.maximumCapacity) {
			const remainder  = this.state.coins + someCoins - this.maximumCapacity
			this.state.coins = this.maximumCapacity

			return remainder
		}

		this.state.coins += someCoins

		return 0
	}

	remove(
		someCoins: number
	): boolean {
		if (someCoins > this.state.coins) {
			return false
		}

		this.state.coins -= someCoins

		return true
	}

}
