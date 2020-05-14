import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates
}                  from './game'

export interface IGameObjectAttributes {
	startCoords: IObjectCoordinates;
}

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
		public type: GameObjectType,
		attributes: IGameObjectAttributes
	) {
		const startCoordinates = attributes.startCoords; 
		if(startCoordinates !== null) {
			this.coordinates = {
				x: startCoordinates.x,
				y: startCoordinates.y
			};
		}
	}
	
}