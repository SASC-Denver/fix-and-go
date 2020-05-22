import {
	ErrorCode,
	GamePlayer,
	IMoveRequest,
	IMoveResponse,
	IResponse,
	IZoneUpdate,
	IZoneUpdates,
	testZoneAttributes,
	Zone
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'

export class ZoneManager {

	coordinator: Coordinator
	testZone: Zone
	updates: IZoneUpdates = {}

	constructor() {
		this.testZone = new Zone()
		this.testZone.initFromAttributes(testZoneAttributes)
	}

	move(
		data: IMoveRequest
	): IResponse | IMoveResponse {
		// console.log(data)

		if (typeof data !== 'object') {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid request'
				}
			}
		}
		// console.log('data.playerId: ' + data.playerId + ', ' + (typeof data.playerId !== 'number'))

		const players = this.coordinator.playerManager.players
		if (typeof data.playerId !== 'number'
			|| !players[data.playerId]) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid player Id'
				}
			}
		}

		const player = players[data.playerId]
		if (player.lastSecondOf.move === this.coordinator.currentSecond) {
			return {
				error: {
					code: ErrorCode.REQUESTING_TOO_FREQUENTLY,
					description: 'Moving too quickly'
				}
			}
		}

		if (typeof data.positionChange !== 'object'
			|| typeof data.positionChange.x !== 'number'
			|| typeof data.positionChange.y !== 'number') {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid move to coordinates'
				}
			}
		}

		const changeInX = data.positionChange.x
		const changeInY = data.positionChange.y

		if (changeInX < -1 || changeInX > 1) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid X coordinate change'
				}
			}
		}

		if (changeInX < -1 || changeInX > 1) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid Y coordinate change'
				}
			}
		}

		if (changeInX === 0 && changeInY === 0) {
			// That's where the Player is
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'No move needed'
				}
			}
		}

		const newX = player.attributes.coordinates.x + changeInX
		const newY = player.attributes.coordinates.y + changeInY

		if (!this.testZone.moveObject(player, newX, newY)) {
			return {
				error: {
					code: ErrorCode.INVALID_REQUEST,
					description: 'Invalid move'
				}
			}
		}

		player.lastSecondOf.move = this.coordinator.currentSecond

		return {
			newCoords: player.attributes.coordinates
		}
	}

	addPlayer(
		player: GamePlayer
	): void {
		const playerAttributes = player.attributes
		ADD_PLAYER_TO_ZONE:
			for (let x = playerAttributes.coordinates.x; x < this.testZone.dimensions.x; x++) {
				for (let y = playerAttributes.coordinates.y; y < this.testZone.dimensions.y; y++) {
					playerAttributes.coordinates = {
						x,
						y
					}
					if (this.testZone.add(player)) {
						break ADD_PLAYER_TO_ZONE
					}
				}
			}
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
}
