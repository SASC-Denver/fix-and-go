import {GameObjectType} from './game'
import {
	GameObject,
	IGameObjectAttributes
}                       from './GameObject'

export interface IObstacleAttributes
	extends IGameObjectAttributes {
	type?: GameObjectType.OBSTACLE
}

/**
 * Any game character, including Player or Boss
 */
export class Obstacle
	extends GameObject {

	attributes: IObstacleAttributes

	constructor(
		attributes: IObstacleAttributes,
	) {
		super(GameObjectType.OBSTACLE, attributes)
	}
}
