import {
	CredentialsChecker,
	ErrorCode,
	GamePlayer,
	IGamePlayerAttributes,
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

		const error = this.credentialsChecker.checkSignUpCredentials(
			signUpRequest.username, signUpRequest.email, signUpRequest.password)

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

		const emailHash    = await this.encodeStringValue(signUpRequest.email)
		const passwordHash = await this.encodeStringValue(signUpRequest.password)

		try {
			const user = await this.userDao.createUser(
				signUpRequest.username, emailHash, passwordHash, attributes)

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
		// console.log(signInRequest)

		const emailHash = await this.encodeStringValue(signInRequest.email)

		const user = await this.userDao.findByEmailHash(emailHash)

		if (!user) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'No user found'
				}
			}
		}

		const passwordHash = await this.encodeStringValue(signInRequest.password)

		if (passwordHash !== user.passwordHash) {
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

	private addPlayer(
		user: IUser
	): ISignInResponse | ISignUpResponse {
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
