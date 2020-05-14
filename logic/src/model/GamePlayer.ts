import {GameCharacter, IGameCharacterAttributes} from './GameCharacter'
import {
	GameObjectType
}                  from './game'

export interface IGamePlayerAttributes
extends IGameCharacterAttributes {
}

/**
 * Human player.
 */
export class GamePlayer
	extends GameCharacter {

	constructor(
		attributes: IGamePlayerAttributes
	) {
		super(GameObjectType.PLAYER, attributes);
	}

}
