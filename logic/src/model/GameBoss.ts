import {GameCharacter, IGameCharacterAttributes} from './GameCharacter'
import {
	GameObjectType
}                  from './game'


export interface IGameBossAttributes
extends IGameCharacterAttributes {
}

/**
 * In game character.
 */
export class GameBoss
	extends GameCharacter {

	constructor(
		attributes: IGameBossAttributes
	) {
		super(GameObjectType.BOSS, attributes);
	}

}
