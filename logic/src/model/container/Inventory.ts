import {error}               from '../../utils/network'
import {
	addEquipmentPack,
	debugPack,
	starterPack
} from '../../zones/TestZone'
import {
	GameObjectType,
	IGameObject,
	IObjectDirectory,
}                            from '../game'
import {IGameCharacterState} from '../GameCharacter'
import {
	GameItem,
	IGameItemAttributes,
	IGameItemIdentifier,
	itemIdentifierSafe
}                            from '../GameItem'
import {IResponse}           from '../network/data'

/**
 * An inventory of objects for a player or a store.
 */
export class Inventory {

	/*
	Directory (map) of all objects by ObjectType and Id
	 */
	objectsDirectory: IObjectDirectory = {}

	/**
	 * Creates a new instance of an inventory
	 */
	constructor(
		public state: IGameCharacterState,
		public maxSize = 20
	) {
		let inventoryItems = state.inventoryItems
		if (!inventoryItems) {
			// inventoryItems = []
			// TODO: replace with above (no default equipment pack)
			inventoryItems = addEquipmentPack(starterPack)
			// inventoryItems = [
			// 	...inventoryItems,
			// 	...addEquipmentPack(debugPack)
			// ]
		}
		state.inventoryItems = []

		for (const item of inventoryItems) {
			this.addItem(new GameItem(item))
		}
	}

	/**
	 * Add an item to an inventory.
	 *
	 * @param inventoryItem
	 */
	addItem(
		inventoryItem: IGameObject
	): boolean {
		if (this.state.inventoryItems.length >= this.maxSize) {
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
		this.state.inventoryItems.push(itemAttributes)

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
		this.state.inventoryItems = this.state.inventoryItems.filter(anItem =>
			!(anItem.type === gameObjectType && anItem.id === gameObjectId))

		return item
	}

	peekItemSafe<IR extends IResponse>(
		itemIdentifier: IGameItemIdentifier,
		callback: (
			item: GameItem
		) => IResponse | IR
	): IResponse | IR {
		return itemIdentifierSafe(itemIdentifier, (
			itemType: GameObjectType.ITEM,
			itemId: number
		) => {
			const item = this.peekItem(itemType, itemId)

			if (!item) {
				return error('Item not in inventory')
			}

			return callback(item)
		})
	}

	peekItem(
		gameObjectType: GameObjectType,
		gameObjectId: number,
	): GameItem {
		const directoryForType = this.objectsDirectory[gameObjectType]
		if (!directoryForType) {
			return null
		}

		return directoryForType[gameObjectId] as GameItem
	}

}
