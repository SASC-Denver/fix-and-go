import {
	GameObjectType,
	IGameObject,
	IObjectDirectory,
}                            from './game'
import {IGameItemAttributes} from './GameItem'

/**
 * An inventory of objects for a player or a store.
 */
export class Inventory {

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	objectsDirectory: IObjectDirectory = {}

	items: IGameItemAttributes[] = []

	/**
	 * Creates a new instance of an inventory
	 */
	constructor(
		public maxSize = 20
	) {
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
		if (this.items.length >= this.maxSize) {
			return false
		}
		const itemAttributes = inventoryItem.attributes as IGameItemAttributes
		let directoryForType = this.objectsDirectory[itemAttributes.type]
		if (!directoryForType) {
			directoryForType                           = {}
			this.objectsDirectory[itemAttributes.type] = directoryForType
		}

		if (directoryForType[itemAttributes.id]) {
			return false
		}

		directoryForType[itemAttributes.id] = inventoryItem
		this.items.push(itemAttributes)

		return true
	}

	/**
	 * Removes an item from an inventory.
	 *
	 * @param gameObjectType  Type of game object.
	 * @param gameObjectId  Id of the game object
	 */
	removeItem(
		gameObjectType: GameObjectType,
		gameObjectId: number,
	): IGameObject {
		const directoryForType = this.objectsDirectory[gameObjectType]
		if (!directoryForType) {
			return null
		}

		const item = directoryForType[gameObjectId]
		if (!item) {
			return null
		}

		delete directoryForType[gameObjectId]
		this.items = this.items.filter(anItem =>
			!(anItem.type === gameObjectType && anItem.id === gameObjectId))

		return item
	}

}
