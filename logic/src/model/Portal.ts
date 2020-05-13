import {
	GameObjectType,
}                  from './game'
import {
    GameObject
} from './GameObject'

/**
 * Any game character, including Player or Boss
 */
export class Portal
	extends GameObject {

	constructor() {
		super(GameObjectType.PORTAL);
	}

}
