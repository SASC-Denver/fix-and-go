import {
	GameObjectType,
}                  from './game'
import {
    GameObject,
    IGameObjectAttributes
} from './GameObject'

export interface IGameItemAttributes
extends IGameObjectAttributes {
	
}

/**
 * Any game character, including Player or Boss
 */
export class GameItem
	extends GameObject {

	constructor(
		attributes: IGameItemAttributes
		) {
		super(GameObjectType.ITEM, attributes);
	}

}
