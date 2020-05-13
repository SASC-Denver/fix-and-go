import {
	GameObjectType,
}                  from './game'
import {
    GameObject
} from './GameObject'

/**
 * Any game character, including Player or Boss
 */
export class GameItem
	extends GameObject {

	constructor() {
		super(GameObjectType.ITEM);
	}

}
