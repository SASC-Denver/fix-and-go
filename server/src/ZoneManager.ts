import {
	error,
	GameItem,
	GameObjectType,
	GamePlayer,
	IDropItemRequest,
	IDropItemResponse,
	IGameItemAttributes,
	IInspectItemsRequest,
	IInspectItemsResponse,
	IMoveRequest,
	IMoveResponse,
	IPickUpItemRequest,
	IPickUpItemResponse,
	IResponse,
	IZoneUpdate,
	IZoneUpdates,
	testZoneAttributes,
	Zone
}                        from '@fix-and-go/logic'
import {AbstractManager} from './AbstractManager'

export class ZoneManager
	extends AbstractManager {

	testZone: Zone
	updates: IZoneUpdates = {}

	constructor() {
		super()
		this.testZone = new Zone()
		this.testZone.initFromAttributes(testZoneAttributes)
	}

	move(
		data: IMoveRequest
	): IResponse | IMoveResponse {
		// console.log(data)
		return this.playerSafe(data, (
			player: GamePlayer
		) => {

			if (player.lastSecondOf.move === this.coordinator.currentSecond) {
				return error('Moving too quickly')
			}

			if (typeof data.positionChange !== 'object'
				|| typeof data.positionChange.x !== 'number'
				|| typeof data.positionChange.y !== 'number') {
				return error('Invalid move to coordinates')
			}

			const changeInX = data.positionChange.x
			const changeInY = data.positionChange.y

			if (changeInX < -1 || changeInX > 1) {
				return error('Invalid X coordinate change')
			}

			if (changeInX < -1 || changeInX > 1) {
				return error('Invalid Y coordinate change')
			}

			if (changeInX === 0 && changeInY === 0) {
				// That's where the Player is
				return error('No move needed')
			}

			const newX = player.attributes.coordinates.x + changeInX
			const newY = player.attributes.coordinates.y + changeInY

			if (!this.testZone.moveObject(player, newX, newY)) {
				return error('Invalid move')
			}

			return this.coordinator.tradeManager.tradeDealSafe(player, () => {
				player.lastSecondOf.move = this.coordinator.currentSecond

				return {
					newCoords: player.attributes.coordinates
				} as IMoveResponse
			})
		})
	}

	addPlayer(
		player: GamePlayer
	): boolean | GamePlayer {
		const playerAttributes = player.attributes

		let addResult: boolean | GamePlayer = false
		ADD_PLAYER_TO_ZONE:
			for (let x = playerAttributes.coordinates.x; x < this.testZone.dimensions.x; x++) {
				for (let y = playerAttributes.coordinates.y; y < this.testZone.dimensions.y; y++) {
					playerAttributes.coordinates = {
						x,
						y
					}
					addResult                    = this.testZone.add(player)
					if (addResult) {
						break ADD_PLAYER_TO_ZONE
					}
				}
			}

		return addResult
	}

	update(): void {
		this.updates = {}

		const players = this.coordinator.playerManager.players
		for (const playerId in players) {
			const player                       = players[playerId]
			player.visionRange                 = {
				high: {
					x: player.attributes.coordinates.x + 5,
					y: player.attributes.coordinates.y + 5
				},
				low: {
					x: player.attributes.coordinates.x - 5,
					y: player.attributes.coordinates.y - 5
				}
			}
			// console.log(player.visionRange)
			const playerUpdates: IZoneUpdate[] = []
			this.updates[player.attributes.id] = playerUpdates
			for (const objectType in this.testZone.objectsDirectory) {
				// console.log('objectType:' + objectType)
				const directoryForType = this.testZone.objectsDirectory[objectType]
				for (const id in directoryForType) {
					const object      = directoryForType[id]
					const coordinates = object.attributes.coordinates
					// console.log('id:' + id + ', x: ' + coordinates.x + ', y: ' + coordinates.y)
					if (coordinates.x >= player.visionRange.low.x
						&& coordinates.x <= player.visionRange.high.x
						&& coordinates.y >= player.visionRange.low.y
						&& coordinates.y <= player.visionRange.high.y) {
						// console.log('in range')
						playerUpdates.push(object.attributes)
					}
				}
			}
		}
	}

	inspectZoneItems(
		request: IInspectItemsRequest
	): IResponse | IInspectItemsResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			return this.coordinator.tradeManager.tradeDealSafe(player, () => {
				const items = this.testZone.itemLayout
					[player.attributes.coordinates.y][player.attributes.coordinates.x]

				return {
					inventory: player.state.inventoryItems,
					zoneItems: items.map(item => item.attributes as IGameItemAttributes)
				} as IInspectItemsResponse
			})
		})
	}

	pickUpZoneItem(
		request: IPickUpItemRequest
	): IResponse | IPickUpItemResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {

			if (player.state.inventoryItems.length >= player.inventory.maxSize) {
				return error('Inventory is full')
			}

			const items = this.testZone.itemLayout
				[player.attributes.coordinates.y][player.attributes.coordinates.x]

			const matchingItems = items.filter(anItem =>
				anItem.attributes.type === request.type
				&& anItem.attributes.id === request.id)

			if (matchingItems.length !== 1
				|| !this.testZone.objectsDirectory[GameObjectType.ITEM][request.id]) {
				return error('Invalid Item')
			}

			return this.coordinator.tradeManager.tradeDealSafe(player, () => {
				const zoneItems = items.filter(anItem => !(anItem.attributes.type === request.type
					&& anItem.attributes.id === request.id))

				this.testZone.itemLayout
					[player.attributes.coordinates.y][player.attributes.coordinates.x]
					= zoneItems

				delete this.testZone.objectsDirectory[GameObjectType.ITEM][request.id]

				const item = matchingItems[0] as GameItem

				player.inventory.addItem(item)

				return {
					inventory: player.state.inventoryItems,
					zoneItems: zoneItems.map(anItem => anItem.attributes as IGameItemAttributes)
				} as IPickUpItemResponse
			})
		})
	}

	dropItemToZone(
		request: IDropItemRequest
	): IResponse | IDropItemResponse {
		return this.playerSafe(request, (
			player: GamePlayer
		) => {
			const items = this.testZone.itemLayout
				[player.attributes.coordinates.y][player.attributes.coordinates.x]

			if (items.length >= 30) {
				return error('Map location is full')
			}

			const item = player.inventory.removeItem(request.type, request.id)

			if (!item) {
				return error('Item not in inventory')
			}

			item.attributes.coordinates = {
				...player.attributes.coordinates
			}

			const addResult = this.testZone.add(item)

			if (typeof addResult !== 'boolean') {
				return error('Item already on Map')
			} else if (!addResult) {
				return error('Error placing item on Map')
			}

			return this.coordinator.tradeManager.tradeDealSafe(player, () => {
				return {
					inventory: player.state.inventoryItems,
					zoneItems: items.map(anItem => anItem.attributes as IGameItemAttributes)
				} as IDropItemResponse
			})
		})
	}

}
