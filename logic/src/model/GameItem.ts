import {error}          from '../utils/network'
import {GameObjectType} from './game'
import {
	GameObject,
	IGameObjectAttributes,
	isValidId
}                       from './GameObject'
import {IResponse}      from './network/data'

export interface IGameItemIdentifier {
	id: number
	name?: string
	type: GameObjectType.ITEM
}

export interface IGameItemAttributes
	extends IGameObjectAttributes {
	name: string
	type: GameObjectType.ITEM
}

export function isValidItemType(
	type: GameObjectType
): boolean {
	return type === GameObjectType.ITEM
}

export function itemIdentifierSafe<IR extends IResponse>(
	itemIdentifier: IGameItemIdentifier,
	callback: (
		itemType: GameObjectType.ITEM,
		itemId: number
	) => IResponse | IR
): IResponse | IR {
	if (!itemIdentifier || typeof itemIdentifier !== 'object') {
		return error('Invalid Item Identifier')
	}
	if (!isValidItemType(itemIdentifier.type)) {
		return error('Invalid Item Type')
	}
	if (!isValidId(itemIdentifier.id)) {
		return error('Invalid Item Id')
	}

	return callback(itemIdentifier.type, itemIdentifier.id)
}

/**
 * Any game character, including Player or Boss
 */
export class GameItem
	extends GameObject {

	attributes: IGameItemAttributes

	constructor(
		attributes: IGameItemAttributes,
	) {
		super(GameObjectType.ITEM, attributes)
	}

}
