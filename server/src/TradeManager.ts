import {
	error,
	GameItem,
	GameObjectType,
	GamePlayer,
	getOtherTradeSidePlayer,
	getTradeSide,
	IExchangeSideOffer,
	IGameItemIdentifier,
	Inventory,
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
	TradeDealChangeType,
	TradeDealState
}                        from '@fix-and-go/logic'
import {AbstractManager} from './AbstractManager'

export class TradeManager
	extends AbstractManager {

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
			return error(`${receiver.state.attributes.username} is already trading.`)
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
				this.removeTradeDeal(player)
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
		return this.commonInputSafe(request, (
			player: GamePlayer,
			tradeDeal: TradeDeal
		) => {
			let yourChange = false
			switch (request.type) {
				case TradeDealChangeType.ADD_THEIR_ITEM:
					return error('Not implemented')
				case TradeDealChangeType.ADD_YOUR_ITEM: {
					const playerTradeDealSide = getTradeSide(tradeDeal.attributes, true, player)
					const itemAlreadyInOffer  = playerTradeDealSide.offer.items.some(
						item =>
							item.type === request.item.type && item.id === request.item.id)

					if (itemAlreadyInOffer) {
						// Player may have double clicked on the item, don't send back
						// an error
						return {
							tradeDealId: tradeDeal.attributes.id
						}
					}

					return player.inventory.peekItemSafe(request.item, (
						item: GameItem
					) => {
						const otherPlayerTradeDealSide = getTradeSide(tradeDeal.attributes, false, player)

						playerTradeDealSide.offer.items.push({
							id: item.attributes.id,
							name: item.attributes.name,
							type: item.attributes.type
						})
						playerTradeDealSide.offer.committed      = false
						otherPlayerTradeDealSide.offer.committed = false
						tradeDeal.attributes.version++

						return {
							tradeDealId: tradeDeal.attributes.id
						} as ITradeDealChangeResponse
					})
				}
				case TradeDealChangeType.CHANGE_YOUR_COINS:
					yourChange = true
				case TradeDealChangeType.CHANGE_THEIR_COINS: {
					if (typeof request.coins !== 'number'
						|| request.coins < 0 || request.coins >= 1000000) {
						return error('Invalid number of coins')
					}
					const playerTradeDealSide      = getTradeSide(tradeDeal.attributes, true, player)
					const otherPlayerTradeDealSide = getTradeSide(tradeDeal.attributes, false, player)
					if (yourChange) {
						playerTradeDealSide.offer.coins = request.coins
					} else {
						otherPlayerTradeDealSide.offer.coins = request.coins
					}

					playerTradeDealSide.offer.committed      = false
					otherPlayerTradeDealSide.offer.committed = false
					tradeDeal.attributes.version++
					return {
						tradeDealId: tradeDeal.attributes.id
					} as ITradeDealChangeResponse
				}
				case TradeDealChangeType.REMOVE_THEIR_ITEM:
					return this.removeTradeDealItem(request.item, tradeDeal, player, false)
				case TradeDealChangeType.REMOVE_YOUR_ITEM:
					return this.removeTradeDealItem(request.item, tradeDeal, player, true)
			}
		})
	}

	// Player cancelled the trade.
	tradeDealCancel(
		request: ITradeDealCancelRequest
	): IResponse | ITradeDealCancelResponse {
		return this.commonInputSafe(request, (
			player: GamePlayer,
			tradeDeal: TradeDeal
		) => {
			tradeDeal.attributes.state = TradeDealState.CANCELLED
			return {
				tradeDealId: tradeDeal.attributes.id
			}
		})
	}

	removeTradeDeal(
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
		return this.commonInputSafe(request, (
			player: GamePlayer,
			tradeDeal: TradeDeal
		) => {
			const playerTradeDealSide
				      = getTradeSide(tradeDeal.attributes, true, player)
			playerTradeDealSide.offer.committed
				      = true

			const otherPlayer = getOtherTradeSidePlayer(tradeDeal, player)
			const otherPlayerTradeDealSide
			                  = getTradeSide(tradeDeal.attributes, false, player)

			if (player.inventory.maxSize <
				player.state.inventoryItems.length + otherPlayerTradeDealSide.offer.items.length) {
				return error(`Cannot commit to trade, your inventory is too full to accept all new items`)
			}
			if (playerTradeDealSide.offer.coins > player.state.coins) {
				return error(`Cannot commit to trade, you have fewer coins than you offered`)
			}

			// console.log()
			// console.log('player:')
			return this.inventoryStateSafe(
				playerTradeDealSide.offer,
				player.inventory,
				(
					playerItemsToRemove: GameItem[]
				) => {
					if (otherPlayerTradeDealSide.offer.committed) {
						if (otherPlayer.inventory.maxSize <
							otherPlayer.state.inventoryItems.length + playerTradeDealSide.offer.items.length) {
							return error(`Cannot commit to trade, "${otherPlayer.state.attributes.username}" inventory is too full to accept all new items`)
						}
						if (otherPlayerTradeDealSide.offer.coins > otherPlayer.state.coins) {
							return error(`Cannot commit to trade, "${otherPlayer.state.attributes.username}" has fewer coins than they offered`)
						}
						// console.log('other player:')
						return this.inventoryStateSafe(
							otherPlayerTradeDealSide.offer,
							otherPlayer.inventory,
							(
								otherPlayerItemsToRemove: GameItem[]
							) => {
								playerItemsToRemove.forEach(item => {
									player.inventory.removeItem(item.attributes.type, item.attributes.id)
								})
								otherPlayerItemsToRemove.forEach(item => {
									otherPlayer.inventory.removeItem(item.attributes.type, item.attributes.id)
								})
								playerItemsToRemove.forEach(item => {
									otherPlayer.inventory.addItem(item)
								})
								otherPlayerItemsToRemove.forEach(item => {
									player.inventory.addItem(item)
								})
								otherPlayer.state.coins += playerTradeDealSide.offer.coins
									- otherPlayerTradeDealSide.offer.coins
								player.state.coins += otherPlayerTradeDealSide.offer.coins
									- playerTradeDealSide.offer.coins

								tradeDeal.attributes.state = TradeDealState.COMPLETED

								return {
									tradeDealId: tradeDeal.attributes.id
								} as ITradeDealCommitResponse
							})
					} else {
						return {
							tradeDealId: tradeDeal.attributes.id
						} as ITradeDealCommitResponse
					}
				})

			return {
				tradeDealId: tradeDeal.attributes.id
			} as ITradeDealCommitResponse
		})
	}

	update(): void {
		this.updates = {}

		const players = this.coordinator.playerManager.players
		for (const playerId in players) {
			const tradeDeal = players[playerId].tradeDeal
			if (tradeDeal) {
				this.updates[playerId] = tradeDeal.attributes

				switch (tradeDeal.attributes.state) {
					case TradeDealState.COMPLETED:
					case TradeDealState.CANCELLED:
						if (tradeDeal.attributes.cleanUpIn > 0) {
							tradeDeal.attributes.cleanUpIn--
						} else {
							this.removeTradeDeal(players[playerId])
						}
						break
				}
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
				case TradeDealState.REQUESTED:
					cancelTradeDeal = true
					break
				case TradeDealState.IN_PROGRESS:
					return error('Error trade deal in progress')
				case TradeDealState.COMPLETED:
				default:
					break
			}
		}
		try {
			return callback()
		} finally {
			if (cancelTradeDeal) {
				this.removeTradeDeal(player)
			}
		}
	}

	private removeTradeDealItem(
		itemIdToRemove: IGameItemIdentifier,
		tradeDeal: TradeDeal,
		player: GamePlayer,
		changeYourOffer: boolean
	): IResponse | ITradeDealChangeResponse {
		const otherPlayer             = getOtherTradeSidePlayer(tradeDeal, player)
		const playerWithOfferToChange = changeYourOffer ? player : otherPlayer
		return playerWithOfferToChange.inventory.peekItemSafe(itemIdToRemove, (
			item: GameItem
		) => {
			const tradeDealSideToChange = getTradeSide(tradeDeal.attributes, changeYourOffer, player)
			const otherTradeDealSide    = getTradeSide(tradeDeal.attributes, !changeYourOffer, player)

			tradeDealSideToChange.offer.items     = tradeDealSideToChange.offer.items.filter((
				itemId: IGameItemIdentifier
			) => !(itemId.id === item.attributes.id
				&& itemId.type === item.attributes.type))
			tradeDealSideToChange.offer.committed = false
			otherTradeDealSide.offer.committed    = false
			tradeDeal.attributes.version++

			return {
				tradeDealId: tradeDeal.attributes.id
			} as ITradeDealChangeResponse
		})
	}

	private inventoryStateSafe(
		offer: IExchangeSideOffer,
		inventory: Inventory,
		callback: (
			itemsToRemove: GameItem[]
		) => IResponse | ITradeDealCommitResponse
	): IResponse | ITradeDealCommitResponse {
		const itemsToRemove: GameItem[] = []

		// console.log('Offer Items:')
		// console.log(JSON.stringify(offer.items, null, 2))
		// console.log('Inventory Items:')
		// console.log(JSON.stringify(inventory.items, null, 2))

		const everyItemInOfferIsInInventory = offer.items.every(itemIdentifier => {
			const itemToRemove = inventory
				.peekItem(itemIdentifier.type, itemIdentifier.id)
			if (!itemToRemove) {
				return false
			}
			itemsToRemove.push(itemToRemove)

			return true
		})

		if (!everyItemInOfferIsInInventory) {
			return error('Not all items to trade found in inventory')
		}

		return callback(itemsToRemove)
	}

	private commonInputSafe<IReq extends ITradeDealRequest, IRes extends ITradeDealResponse>(
		request: IReq,
		callback: (
			player: GamePlayer,
			tradeDeal: TradeDeal
		) => IRes | IResponse
	): IResponse | IRes {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			if (!player.tradeDeal) {
				return error('Player is not in a trade deal')
			}

			if (request.tradeDealId !== player.tradeDeal.attributes.id) {
				return error('Wrong Trade Deal Id')
			}

			return callback(player, player.tradeDeal)
		})
	}

}
