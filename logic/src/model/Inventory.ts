import {
	IGameObject,
	IObjectDirectoryById,
} from './game'

/**
 * An inventory of objects for a player or a store.
 */
export class Inventory {

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	objectsDirectory: IObjectDirectoryById = {}

	/**
	 * Creates a new instance of an inventory
	 */
	constructor() {
		// Implement
	}

	/**
	 * Add an item to an inventory.
	 *
	 * @param inventoryItem
	 */
	addItem(
		inventoryItem: IGameObject
	): boolean {
		throw new Error('Not implemented')
	}

	/**
	 * Removes an item from an inventory.
	 *
	 * @param gameObjectType  Type of game object.
	 * @param gameObjectId  Id of the game object
	 */
	removeItem(
		gameObjectType: string,
		gameObjectId: number,
	): boolean {
		throw new Error('Not implemented')
	}

}
