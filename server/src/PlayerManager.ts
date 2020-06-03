import {
	CredentialsChecker,
	error,
	GamePlayer,
	IGamePlayerAttributes,
	IInventoryRequest,
	IInventoryResponse,
	IResetPasswordRequest,
	IResetPasswordResponse,
	IResponse,
	ISignInRequest,
	ISignInResponse,
	ISignUpRequest,
	ISignUpResponse
}                        from '@fix-and-go/logic'
import {AbstractManager} from './AbstractManager'
import {UserDao}         from './db/dao/UserDao'
import {IUser}           from './db/model/User'

const jsSHA = require('jssha')

export class PlayerManager
	extends AbstractManager {

	credentialsChecker = new CredentialsChecker()
	players: {
		[id: number]: GamePlayer
	}                  = {}
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
			maxHealth: 15,
			maxMagic: 10,
			username: signUpRequest.username
		}

		try {
			const user = await this.userDao.createUser(
				signUpRequest.username, signUpRequest.encodedEmail,
				signUpRequest.encodedPassword, attributes)

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
				inventory: player.inventory.items,
				purse: player.purse.coins
			} as IInventoryResponse
		})
	}

	private addPlayer(
		user: IUser
	): ISignInResponse | ISignUpResponse {
		// console.log(JSON.stringify(user, null, 2))
		user.attributes.id = user.id

		// console.log('Player id: ' + user.id)

		const newPlayer = new GamePlayer(user.attributes)
		const result    = this.coordinator.zoneManager.addPlayer(newPlayer)

		if (result && typeof result === 'boolean') {
			this.players[user.id] = newPlayer
		}

		return {
			attributes: user.attributes
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
