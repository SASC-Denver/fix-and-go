import {GameObjectType} from './game'
import {
	GameObject,
	IGameObjectAttributes
}                       from './GameObject'

export interface IPortalAttributes
	extends IGameObjectAttributes {
	type?: GameObjectType.PORTAL
}

/**
 * Any game character, including Player or Boss
 */
export class Portal
	extends GameObject {

	attributes: IPortalAttributes

	constructor(
		attributes: IPortalAttributes,
	) {
		super(GameObjectType.PORTAL, attributes)
	}
}
