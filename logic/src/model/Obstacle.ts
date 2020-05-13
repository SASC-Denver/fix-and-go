import {
	GameObjectType,
}                  from './game'
import {
    GameObject
} from './GameObject'

/**
 * Any game character, including Player or Boss
 */
export class Obstacle
	extends GameObject {

	constructor() {
		super(GameObjectType.OBSTACLE);
	}

}
