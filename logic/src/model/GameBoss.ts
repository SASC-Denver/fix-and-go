import {GameObjectType} from './game'
import {
	GameCharacter,
	IGameCharacterAttributes
}                       from './GameCharacter'

export interface IGameBossAttributes
extends IGameCharacterAttributes {
	type?: GameObjectType.BOSS
}

/**
 * In game character.
 */
export class GameBoss
	extends GameCharacter {

	attributes: IGameBossAttributes

	constructor(
		attributes: IGameBossAttributes
	) {
		super(GameObjectType.BOSS, attributes);
	}

}
