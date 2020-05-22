import {
	GamePlayer,
	IGamePlayerAttributes,
	ISignInRequest,
	Zone
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'

export class PlayerManager {
	coordinator: Coordinator
	players: {
		[id: number]: GamePlayer
	} = {}

	signIn(
		signInRequest: ISignInRequest
	): IGamePlayerAttributes {
		// console.log(signInRequest)

		const id                                      = ++Zone.lastObjectId
		const playerAttributes: IGamePlayerAttributes = {
			coordinates: {
				x: 5,
				y: 4,
			},
			id,
			maxHealth: 15,
			maxMagic: 10,
			username: signInRequest.username
		}

		const newPlayer = new GamePlayer(playerAttributes)

		// console.log('New player id: ' + id)
		this.players[id] = newPlayer

		this.coordinator.zoneManager.addPlayer(newPlayer)

		return playerAttributes
	}
}
