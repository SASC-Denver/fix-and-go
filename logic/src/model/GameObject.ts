import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates
} from './game'

export interface IGameObjectAttributes {
	coordinates: IObjectCoordinates;
	id?: number;
	type?: GameObjectType;
}

/**
 * Any game character, including Player or Boss
 */
export class GameObject
	implements IGameObject {

	constructor(
		type: GameObjectType,
		public attributes: IGameObjectAttributes
	) {
		attributes.type = type;
	}

}
