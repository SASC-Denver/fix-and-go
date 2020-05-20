import {
	IGameObject,
	IObjectCoordinates,
	IObjectDirectoryById,
}                            from '../model/game'
import {
	GameBoss,
	IGameBossAttributes
}                            from '../model/GameBoss'
import {
	GameItem,
	IGameItemAttributes
} from '../model/GameItem'
import {
	IObstacleAttributes,
	Obstacle
}                            from '../model/Obstacle'
import {
	IPortalAttributes,
	Portal
}                            from '../model/Portal'
import {
	IStoreAttributes,
	Store
}                            from '../model/Store'

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
	/*
	Two dimensional array of references to objects in the zone,
	with array indexes being the X and Y coordinates.
	 */
	objectLayout: IGameObject[][] = []

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	private objectsDirectory: IObjectDirectoryById = {}

	private dimensions: IZoneDimensions

	/**
	 * Zones are rectangles with coordinates from 0 to endX and 0 to endY
	 *
	 * @param endX - end X coordinate
	 * @param endY - end Y coordinate
	 */
	constructor(
		attributes: IZoneAttributes
	) {
		this.dimensions = {
			x: attributes.dimensions.x,
			y: attributes.dimensions.y
		}

		for (let y = 0; y < this.dimensions.y; y++) {
			this.objectLayout[y] = []
			for (let x = 0; x < this.dimensions.x; x++) {
				this.objectLayout[y][x] = null
			}
		}

		if (attributes.bosses) {
			for (let i = 0; i < attributes.bosses.length; i++) {
				this.add(new GameBoss(attributes.bosses[i]))
			}
		}

		if (attributes.items) {
			for (let i = 0; i < attributes.items.length; i++) {
				this.add(new GameItem(attributes.items[i]))
			}
		}

		if (attributes.obstacles) {
			attributes.obstacles.forEach((obstacleAttributes: IObstacleAttributes) => {
				this.add(new Obstacle(obstacleAttributes))
			})
		}

		if (attributes.portals) {
			attributes.portals.forEach((portalAttributes) => {
				this.add(new Portal(portalAttributes))
			})
		}

		if (attributes.stores) {
			attributes.stores.forEach(storesAttributes => {
				this.add(new Store(storesAttributes))
			})
		}
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
		const coordinates = object.coordinates
		if (!object || this.objectLayout[coordinates.y][coordinates.x]) {
			return false
		}
		this.objectLayout[coordinates.y][coordinates.x] = object

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
		newY: number,
		checkNewCell = true
	): boolean {
		if (!this.isMoveWithinDimensions(newX, newY)) {
			return false
		}

		if (checkNewCell && this.objectLayout[newY][newX]) {
			return false
		}

		if (this.objectLayout[object.coordinates.y][object.coordinates.x]
			!== object) {
			return false
		}

		this.objectLayout[object.coordinates.y][object.coordinates.x] = null
		this.objectLayout[newY][newX]                                 = object

		object.coordinates = {
			x: newX,
			y: newY,
		}

		return true
	}
}
