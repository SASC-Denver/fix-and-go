import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates,
	IObjectDirectory
}                              from '../model/game'
import {
	GameBoss,
	IGameBossAttributes,
	IGameBossState
}                              from '../model/GameBoss'
import {
	GameItem,
	IGameItemAttributes
}                              from '../model/GameItem'
import {IGameObjectAttributes} from '../model/GameObject'
import {
	GamePlayer,
	IGamePlayerAttributes
}                              from '../model/GamePlayer'
import {
	IObstacleAttributes,
	Obstacle
}                              from '../model/Obstacle'
import {
	IPortalAttributes,
	Portal
}                              from '../model/Portal'
import {
	IStoreAttributes,
	Store
}                              from '../model/Store'

export interface IZoneDimensions {
	x: number;
	y: number;
}

export interface IZoneAttributes {
	bosses: IGameBossState[];
	dimensions: IZoneDimensions;
	items: IGameItemAttributes[];
	obstacles: IObstacleAttributes[];
	portals: IPortalAttributes[];
	stores: IStoreAttributes[];
}

/*
	Represents the state of the a zone in the game.  Game consists of multiple
	zones between which players move.
 */
export class Zone {

	static lastObjectId = 0

	dimensions: IZoneDimensions

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	objectsDirectory: IObjectDirectory = {}

	/*
	Two dimensional array of references to objects in the zone,
	with array indexes being the Y and X coordinates.
	 */
	objectLayout: IGameObject[][] = []

	/*
	Two dimensional array of references to items in the zone,
	with array indexes being the Y and X coordinates.
	 */
	itemLayout: IGameObject[][][] = []

	/**
	 * Zones are rectangles with coordinates from 0 to endX and 0 to endY
	 *
	 * @param endX - end X coordinate
	 * @param endY - end Y coordinate
	 */
	constructor() {
		// Nothing to initialize, yet
	}

	initFromAttributes(
		attributes: IZoneAttributes
	): void {
		this.dimensions = {
			x: attributes.dimensions.x,
			y: attributes.dimensions.y
		}
		this.initLayouts()

		if (attributes.bosses) {
			for (let i = 0; i < attributes.bosses.length; i++) {
				const bossState         = attributes.bosses[i]
				bossState.attributes.id = ++Zone.lastObjectId
				this.add(new GameBoss(bossState))
			}
		}

		if (attributes.items) {
			for (let i = 0; i < attributes.items.length; i++) {
				const itemAttributes = attributes.items[i]
				itemAttributes.id    = ++Zone.lastObjectId
				this.add(new GameItem(itemAttributes))
			}
		}

		if (attributes.obstacles) {
			attributes.obstacles.forEach((obstacleAttributes: IObstacleAttributes) => {
				obstacleAttributes.id = ++Zone.lastObjectId
				this.add(new Obstacle(obstacleAttributes))
			})
		}

		if (attributes.portals) {
			attributes.portals.forEach((portalAttributes) => {
				portalAttributes.id = ++Zone.lastObjectId
				this.add(new Portal(portalAttributes))
			})
		}

		if (attributes.stores) {
			attributes.stores.forEach(storesAttributes => {
				storesAttributes.id = ++Zone.lastObjectId
				this.add(new Store(storesAttributes))
			})
		}
	}

	initLayouts(): void {
		this.objectLayout = []
		this.itemLayout   = []
		for (let y = 0; y < this.dimensions.y; y++) {
			this.objectLayout[y] = []
			this.itemLayout[y]   = []
			for (let x = 0; x < this.dimensions.x; x++) {
				this.objectLayout[y][x] = null
				this.itemLayout[y][x]   = []
			}
		}
	}

	updateObjects(
		dimensions: IZoneDimensions,
		attributesList: IGameObjectAttributes[],
		player: GamePlayer,
	): void {
		this.dimensions       = dimensions
		this.objectsDirectory = {}
		this.initLayouts()

		attributesList.forEach(attributes => {
			switch (attributes.type) {
				case GameObjectType.BOSS:
					this.add(new GameBoss({
						attributes: attributes as IGameBossAttributes,
						coins: 0,
						inventoryItems: [],
						stats: {
							armorClass: 0,
							attack: {
								diceSides: 0,
								numberOfDice: 0,
							},
							attackBonus: 0,
							sightRange: 1
						}
					}))
					break
				case GameObjectType.ITEM:
					this.add(new GameItem(attributes as IGameItemAttributes))
					break
				case GameObjectType.OBSTACLE:
					this.add(new Obstacle(attributes as IObstacleAttributes))
					break
				case GameObjectType.PLAYER:
					let newPlayer: GamePlayer
					if (player && player.attributes.id === attributes.id) {
						player.attributes = attributes as IGamePlayerAttributes
						newPlayer         = player
					} else {
						newPlayer = new GamePlayer({
							attributes: attributes as IGamePlayerAttributes,
							coins: 0,
							equipmentState: null,
							inventoryItems: [],
							stats: GamePlayer.getDefaultStats()
						})
					}
					this.add(newPlayer)
					break
				case GameObjectType.PORTAL:
					this.add(new Portal(attributes as IPortalAttributes))
					break
				case GameObjectType.STORE:
					this.add(new Store(attributes as IStoreAttributes))
					break
			}
		})
	}

	/**
	 * Add object to a zone.
	 *
	 * @param object   object to add
	 * @param x   new X coordinates of the object
	 * @param y   new Y coordinates of the object
	 *
	 * @return true if object was added, false otherwise
	 */
	add<GO extends IGameObject>(
		object: GO
	): boolean | GO {

		let directoryForType = this.objectsDirectory[object.attributes.type]
		if (!directoryForType) {
			directoryForType                              = {}
			this.objectsDirectory[object.attributes.type] = directoryForType
		}

		if (directoryForType[object.attributes.id]) {
			// This object is already in place
			return directoryForType[object.attributes.id] as GO
		}

		const coordinates = object.attributes.coordinates

		if (object instanceof GameItem) {
			this.itemLayout[coordinates.y][coordinates.x].unshift(object)
		} else if (!this.objectLayout
			|| !this.objectLayout[coordinates.y]
			|| this.objectLayout[coordinates.y][coordinates.x]) {
			return false
		} else {
			this.objectLayout[coordinates.y][coordinates.x] = object
		}

		directoryForType[object.attributes.id] = object

		return true
	}

	/**
	 * Remove object from a zone.
	 *
	 * @param gameObjectId   Id of the object to remove
	 *
	 * @return true if object was added, false otherwise
	 */
	remove(gameObjectId: number): boolean {
		throw new Error('Not implemented')
	}

	/**
	 * Move object in a zone.
	 *
	 * @param gameObjectType  Type of Game Object (GameObjectType)
	 * @param gameObjectId  Id of Game Object
	 * @param changeInX  (-1, 0, 1)
	 * @param changeInY  (-1, 0, 1)
	 *
	 * @return new Coordinates of the object
	 */
	move(
		gameObjectType: string,
		gameObjectId: number,
		changeInX: number,
		changeInY: number
	): IObjectCoordinates {
		throw new Error('Not implemented')
	}

	isPositionWithinDimensions(
		x: number,
		y: number
	): boolean {

		if (x < 0 || y < 0) {
			return false
		}
		if (x >= this.dimensions.x || y >= this.dimensions.y) {
			return false
		}

		return true
	}

	isPositionOccupied(
		x: number,
		y: number
	): boolean {
		return !!this.objectLayout[y][x]
	}

	/**
	 * Move object in a zone.
	 *
	 * @param object  Game Object to move
	 * @param newX  New X position of object
	 * @param newY  New Y position of object
	 *
	 * @return new Coordinates of the object
	 */
	moveObject(
		object: IGameObject,
		newX: number,
		newY: number
	): boolean {
		if (!this.isPositionWithinDimensions(newX, newY)) {
			return false
		}

		if (this.objectLayout[newY][newX]) {
			return false
		}

		if (this.objectLayout
				[object.attributes.coordinates.y][object.attributes.coordinates.x]
			!== object) {
			return false
		}

		this.objectLayout[object.attributes.coordinates.y][object.attributes.coordinates.x]
			                            = null
		this.objectLayout[newY][newX] = object

		object.attributes.coordinates = {
			x: newX,
			y: newY,
		}

		return true
	}
}
