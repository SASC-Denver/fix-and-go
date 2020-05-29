import {GameObjectType} from './game'
import {
	GameObject,
	IGameObjectAttributes
}                       from './GameObject'

export interface IGameItemAttributes
	extends IGameObjectAttributes {
	type?: GameObjectType.ITEM
	name: string
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
