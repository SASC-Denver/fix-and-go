import {
	CredentialsChecker,
	error,
	GameItem,
	GamePlayer,
	IEquipItemRequest,
	IEquipItemResponse,
	IGamePlayerAttributes,
	IGamePlayerState,
	IInventoryRequest,
	IInventoryResponse,
	IResetPasswordRequest,
	IResetPasswordResponse,
	IResponse,
	ISignInRequest,
	ISignInResponse,
	ISignUpRequest,
	ISignUpResponse,
	IUnequipItemRequest,
	IUnequipItemResponse
}                        from '@fix-and-go/logic'
import {AbstractManager} from './AbstractManager'
import {UserDao}         from './db/dao/UserDao'
import {IUser}           from './db/model/User'
import {StatsManager}    from './StatsManager'

const jsSHA = require('jssha')

export class PlayerManager
	extends AbstractManager {

	credentialsChecker = new CredentialsChecker()
	players: {
		[id: number]: GamePlayer
	}                  = {}
	statsManager       = new StatsManager()
	userDao            = new UserDao()

	async signUp(
		signUpRequest: ISignUpRequest
	): Promise<IResponse | ISignUpResponse> {
		// console.log(signUpRequest)

		const credentialsError = this.credentialsChecker.serverCheckCredentials(
			signUpRequest.username, signUpRequest.encodedEmail,
			signUpRequest.encodedPassword)

		if (credentialsError) {
			return {
				error: credentialsError
			}
		}

		const attributes: IGamePlayerAttributes = {
			coordinates: {
				x: 5,
				y: 4,
			},
			maxHealth: 100,
			maxEnergy: 100,
			username: signUpRequest.username
		}

		const state: IGamePlayerState = {
			attributes,
			coins: 0,
			equipmentState: null,
			inventoryItems: [],
			stats: GamePlayer.getDefaultStats()
		}

		try {
			const user = await this.userDao.createUser(
				signUpRequest.username, signUpRequest.encodedEmail,
				signUpRequest.encodedPassword, state)

			// console.log(JSON.stringify(user, null, '\t'))

			attributes.id = user.id

			return this.addPlayer(user)
		} catch (anError) {
			return error(anError.message)
		}
	}

	async signIn(
		signInRequest: ISignInRequest
	): Promise<IResponse | ISignInResponse> {
		// console.log(JSON.stringify(signInRequest, null, 2))

		const user = await this.userDao.findByEncodedEmail(signInRequest.encodedEmail)

		if (!user) {
			return error('No user found')
		}

		if (signInRequest.encodedPassword !== user.encodedPassword) {
			return error('Password does not match')
		}

		const loggedInPlayer = this.players[user.id]
		if (loggedInPlayer) {
			return {
				state: loggedInPlayer.state
			}
		}

		return this.addPlayer(user)
	}

	async resetPassword(
		resetPasswordRequest: IResetPasswordRequest
	): Promise<IResponse | IResetPasswordResponse> {
		// test
		return null
	}

	getInventory(
		request: IInventoryRequest
	): IResponse | IInventoryResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			return {
				inventoryItems: player.state.inventoryItems,
				purse: player.state.coins
			} as IInventoryResponse
		})
	}

	equipItem(
		request: IEquipItemRequest
	): IResponse | IEquipItemResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			return player.inventory.peekItemSafe(request.item, (
				item: GameItem
			) => {
				const result = player.equipment.equip(item)

				if (!result.success) {
					return error('Item is not a piece of equipment')
				}

				player.inventory.removeItem(item.attributes.type, item.attributes.id)

				if (result.unequippedItem) {
					player.inventory.addItem(result.unequippedItem)
				}

				this.statsManager.onEquipmentAdd(player, item, result.unequippedItem)

				return {
					attributes: player.state.attributes,
					equipmentState: player.state.equipmentState,
					inventoryItems: player.state.inventoryItems,
					stats: player.state.stats,
					success: true
				} as IEquipItemResponse
			})
		})
	}

	unequipItem(
		request: IUnequipItemRequest
	): IResponse | IUnequipItemResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			if (player.inventory.maxSize <= player.state.inventoryItems.length) {
				return error('Inventory is full')
			}

			const removedItem = player.equipment.unequip(request.equipmentSlot)

			if (!removedItem) {
				return error('No Item equipped at slot ' + request.equipmentSlot)
			}

			player.inventory.addItem(removedItem)

			this.statsManager.onEquipmentRemove(player, removedItem)

			return {
				attributes: player.state.attributes,
				equipmentState: player.state.equipmentState,
				inventoryItems: player.state.inventoryItems,
				stats: player.state.stats,
				success: true
			} as IEquipItemResponse
		})
	}

	private addPlayer(
		user: IUser
	): ISignInResponse | ISignUpResponse {
		// console.log(JSON.stringify(user, null, 2))
		user.state.attributes.id = user.id

		// console.log('Player id: ' + user.id)

		const newPlayer = new GamePlayer(user.state)
		const result    = this.coordinator.zoneManager.addPlayer(newPlayer)

		if (result && typeof result === 'boolean') {
			this.players[user.id] = newPlayer
		}

		return {
			state: user.state
		}
	}

	private async encodeStringValue(
		stringValue: string
	): Promise<string> {
		const shaObj = new jsSHA('SHA-512', 'TEXT')
		shaObj.update(stringValue)

		const hash = shaObj.getHash('B64')
		// console.log('Hash: ' + hash)
		// console.log('Hash length: ' + hash.length)

		return hash
	}

}
