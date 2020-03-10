import {
	IGameObject,
	IObjectCoordinates,
	IObjectDirectoryById,
} from '../model/game'


/*
	Represents the state of the a zone in the game.  Game consists of multiple
	zones between which players move.
 */
export class Zone {

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	private objectsDirectory: IObjectDirectoryById = {}

	/*
	Two dimensional array of references to objects in the zone,
	with array indexes being the X and Y coordinates.
	 */
	private objectLayout: IGameObject[][] = []

	/**
	 * Zones are rectangles with coordinates from 0 to endX and 0 to endY
	 *
	 * @param endX - end X coordinate
	 * @param endY - end Y coordinate
	 */
	constructor(
		private endX: number,
		private endY: number,
	) {
		for (let x = 0; x < endX; x++) {
			this.objectLayout[x] = []
			for (let y = 0; y < endY; y++) {
				this.objectLayout[x][y] = null
			}
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
		object: IGameObject,
		x: number,
		y: number,
	): boolean {
		throw new Error('Not implemented')
	}

	/**
	 * Remove object from a zone.
	 *
	 * @param gameObjectId   Id of the object to remove
	 *
	 * @return true if object was added, false otherwise
	 */
	remove(
		gameObjectId: number,
	): boolean {
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
		changeInY: number,
	): IObjectCoordinates {
		throw new Error('Not implemented')
	}

}
