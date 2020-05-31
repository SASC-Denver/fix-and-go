import {
	error,
	GameObjectType,
	GamePlayer,
	IResponse,
	ITradeDealCancelRequest,
	ITradeDealCancelResponse,
	ITradeDealChangeRequest,
	ITradeDealChangeResponse,
	ITradeDealCommitRequest,
	ITradeDealCommitResponse,
	ITradeDealReplyRequest,
	ITradeDealReplyResponse,
	ITradeDealRequest,
	ITradeDealResponse,
	ITradeDealStartRequest,
	ITradeDealStartResponse,
	ITradeDealUpdates,
	TradeDeal,
	TradeDealState
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'

export class TradeManager {

	coordinator: Coordinator
	lastTradeDealId            = 0
	tradeDealMapById: {
		[tradeDealId: number]: TradeDeal
	}                          = {}
	updates: ITradeDealUpdates = {}

	// Player initiated a trade (with another player or store).
	tradeDealStart(
		request: ITradeDealStartRequest
	): IResponse | ITradeDealStartResponse {
		const initiator = this.coordinator.playerManager.players[request.playerId]

		if (!initiator) {
			return error('Invalid player Id')
		}

		// TODO: lookup the zone properly
		const requestorZone = this.coordinator.zoneManager.testZone

		const receiver = requestorZone.objectsDirectory
			[GameObjectType.PLAYER][request.toPlayerId] as GamePlayer

		if (!receiver) {
			return error('Other player is not found in zone')
		}

		if (receiver.tradeDeal) {
			return error(`${receiver.attributes.username} is already trading.`)
		}

		const initiatorCoords = initiator.attributes.coordinates
		const receiverCoords  = receiver.attributes.coordinates

		const xDiff = initiatorCoords.x - receiverCoords.x
		const yDiff = initiatorCoords.y - receiverCoords.y

		if (xDiff > 1 || xDiff < -1 || yDiff > 1 || yDiff < -1) {
			return error('Other player is not adjacent')
		}

		const tradeDealId = ++this.lastTradeDealId

		const tradeDeal = new TradeDeal(tradeDealId, initiator, receiver)

		this.tradeDealMapById[tradeDealId] = tradeDeal

		initiator.tradeDeal = tradeDeal
		receiver.tradeDeal  = tradeDeal

		return {
			tradeDealId
		}
	}

	// Player replied to initial trade deal request (yes/now).
	tradeDealReply(
		request: ITradeDealReplyRequest
	): IResponse | ITradeDealReplyResponse {
		return this.commonInputSafe(request, (player: GamePlayer) => {
			if (typeof request.accept !== 'boolean') {
				return error('Must accept or decline to enter a Trade Deal')
			}

			const tradeDealAttributes = player.tradeDeal.attributes

			if (request.accept) {
				tradeDealAttributes.state = TradeDealState.IN_PROGRESS
			} else {
				this.doTradeDealCancel(player)
			}

			return {
				tradeDealId: tradeDealAttributes.id
			}
		})
	}

	// Player changed terms of the trade.
	tradeDealChange(
		request: ITradeDealChangeRequest
	): IResponse | ITradeDealChangeResponse {
		return null
	}

	// Player cancelled the trade.
	tradeDealCancel(
		request: ITradeDealCancelRequest
	): IResponse | ITradeDealCancelResponse {
		return this.commonInputSafe(request, (player: GamePlayer) => {
			const tradeDeal = player.tradeDeal
			this.doTradeDealCancel(player)

			return {
				tradeDealId: tradeDeal.attributes.id
			}
		})
	}

	doTradeDealCancel(
		player: GamePlayer
	): void {
		const tradeDeal = player.tradeDeal
		delete this.tradeDealMapById[tradeDeal.attributes.id]

		tradeDeal.parties.initiator.tradeDeal = null
		tradeDeal.parties.receiver.tradeDeal  = null
	}

	// Player committed to the trade.
	tradeDealCommit(
		request: ITradeDealCommitRequest
	): IResponse | ITradeDealCommitResponse {
		return null
	}

	update(): void {
		this.updates = {}

		const players = this.coordinator.playerManager.players
		for (const playerId in players) {
			const player = players[playerId]
			if (player.tradeDeal) {
				this.updates[playerId] = player.tradeDeal.attributes
			}
		}
	}

	tradeDealSafe<IR extends IResponse>(
		player: GamePlayer,
		callback: () => IResponse | IR
	): IResponse | IR {
		let cancelTradeDeal = false
		if (player.tradeDeal) {
			switch (player.tradeDeal.attributes.state) {
				case TradeDealState.STARTED:
					cancelTradeDeal = true
					break
				case TradeDealState.IN_PROGRESS:
				case TradeDealState.COMMITTED:
					return error('Error trade deal in progress')
			}
		}
		try {
			return callback()
		} finally {
			if (cancelTradeDeal) {
				this.doTradeDealCancel(player)
			}
		}
	}

	private commonInputSafe<IReq extends ITradeDealRequest, IRes extends ITradeDealResponse>(
		request: IReq,
		callback: (player: GamePlayer) => IRes | IResponse
	): IResponse | IRes {

		const player = this.coordinator.playerManager
			.players[request.playerId]
		if (!player) {
			return error('Invalid player')
		}

		if (!player.tradeDeal) {
			return error('Player is not in a trade deal')
		}

		if (request.tradeDealId !== player.tradeDeal.attributes.id) {
			return error('Wrong Trade Deal Id')
		}

		return callback(player)
	}

}
