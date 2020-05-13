import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates
}                  from './game'

/**
 * Any game character, including Player or Boss
 */
export class GameObject
	implements IGameObject {

	coordinates: IObjectCoordinates = {
		x: -1,
		y: -1
	};

	constructor(
		public type: GameObjectType
	) {
	}
	
}