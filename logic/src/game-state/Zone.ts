import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates,
	IObjectDirectory
}                              from '../model/game'
import {
	GameBoss,
	IGameBossAttributes
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
	bosses: IGameBossAttributes[];
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
	with array indexes being the X and Y coordinates.
	 */
	objectLayout: IGameObject[][] = []

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
		this.initObjectLayout()

		if (attributes.bosses) {
			for (let i = 0; i < attributes.bosses.length; i++) {
				const bossAttributes = attributes.bosses[i]
				bossAttributes.id    = ++Zone.lastObjectId
				this.add(new GameBoss(bossAttributes))
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

	initObjectLayout(): void {
		this.objectLayout = []
		for (let y = 0; y < this.dimensions.y; y++) {
			this.objectLayout[y] = []
			for (let x = 0; x < this.dimensions.x; x++) {
				this.objectLayout[y][x] = null
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
		this.initObjectLayout()

		attributesList.forEach(attributes => {
			switch (attributes.type) {
				case GameObjectType.BOSS:
					this.add(new GameBoss(attributes as IGameBossAttributes))
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
						newPlayer = new GamePlayer(attributes as IGamePlayerAttributes)
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
	add(
		object: IGameObject
	): boolean {
		const coordinates = object.attributes.coordinates
		if (!object || this.objectLayout[coordinates.y][coordinates.x]) {
			return false
		}
		this.objectLayout[coordinates.y][coordinates.x] = object

		let directoryForType = this.objectsDirectory[object.attributes.type]
		if (!directoryForType) {
			directoryForType                              = {}
			this.objectsDirectory[object.attributes.type] = directoryForType
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

	isMoveWithinDimensions(
		newX: number,
		newY: number
	) {

		if (newX < 0 || newY < 0) {
			return false
		}
		if (newX >= this.dimensions.x || newY >= this.dimensions.y) {
			return false
		}

		return true
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
		if (!this.isMoveWithinDimensions(newX, newY)) {
			return false
		}

		if (this.objectLayout[newY][newX]) {
			return false
		}

		if (this.objectLayout[object.attributes.coordinates.y][object.attributes.coordinates.x]
			!== object) {
			return false
		}

		this.objectLayout[object.attributes.coordinates.y][object.attributes.coordinates.x] = null
		this.objectLayout[newY][newX]                                                       = object

		object.attributes.coordinates = {
			x: newX,
			y: newY,
		}

		return true
	}
}
