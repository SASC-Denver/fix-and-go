import {
	error,
	GamePlayer,
	IRequest,
	IResponse
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'

export abstract class AbstractManager {

	coordinator: Coordinator

	playerSafe<IReq extends IRequest, IRes extends IResponse>(
		request: IReq,
		callback: (
			player: GamePlayer
		) => IRes | IResponse
	): IResponse | IRes {
		// console.log(JSON.stringify(request, null, 2))

		if (!request || typeof request !== 'object') {
			return error('Invalid request')
		}

		const playerId = parseInt(request.playerId as any, 10)

		if (typeof playerId !== 'number') {
			return error('Invalid player id')
		}

		const player = this.coordinator.playerManager
			.players[playerId]
		if (!player) {
			return error('Invalid player')
		}

		return callback(player)
	}
}
