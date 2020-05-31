export class Purse {

	coins           = 0
	maximumCapacity = 500000

	add(
		someCoins: number
	): number {
		if (this.coins + someCoins > this.maximumCapacity) {
			const remainder = this.coins + someCoins - this.maximumCapacity
			this.coins      = this.maximumCapacity

			return remainder
		}

		this.coins += someCoins

		return 0
	}

	remove(
		someCoins: number
	): boolean {
		if (someCoins > this.coins) {
			return false
		}

		this.coins -= someCoins

		return true
	}

}
