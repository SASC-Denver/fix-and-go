import {
	CredentialsChecker,
	ErrorCode,
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
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'
import {UserDao}     from './db/dao/UserDao'
import {IUser}       from './db/model/User'

const jsSHA = require('jssha')

export class PlayerManager {

	coordinator: Coordinator
	credentialsChecker = new CredentialsChecker()
	players: {
		[id: number]: GamePlayer
	}                  = {}
	userDao            = new UserDao()

	async signUp(
		signUpRequest: ISignUpRequest
	): Promise<IResponse | ISignUpResponse> {
		// console.log(signUpRequest)

		const error = this.credentialsChecker.serverCheckCredentials(
			signUpRequest.username, signUpRequest.encodedEmail,
			signUpRequest.encodedPassword)

		if (error) {
			return {
				error
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
		} catch (error) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: error.message
				}
			}
		}
	}

	async signIn(
		signInRequest: ISignInRequest
	): Promise<IResponse | ISignInResponse> {
		// console.log(JSON.stringify(signInRequest, null, 2))

		const user = await this.userDao.findByEncodedEmail(signInRequest.encodedEmail)

		if (!user) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'No user found'
				}
			}
		}

		if (signInRequest.encodedPassword !== user.encodedPassword) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Password does not match'
				}
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
		const playerId = request.playerId
		if (!playerId
			|| typeof playerId !== 'number') {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid player ID'
				}
			}
		}

		const player = this.players[request.playerId]
		if (!player) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid player'
				}
			}
		}

		return {
			inventory: player.inventory.items
		}
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
