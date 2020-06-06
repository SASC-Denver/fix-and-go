import {GameObjectType} from './game'
import {
	GameCharacter,
	IGameCharacterAttributes,
	IGameCharacterState
}                       from './GameCharacter'

export interface IGameBossState
	extends IGameCharacterState {
	attributes: IGameBossAttributes
}

export interface IGameBossAttributes
	extends IGameCharacterAttributes {
	type?: GameObjectType.BOSS
}

/**
 * In game character.
 */
export class GameBoss
	extends GameCharacter {

	constructor(
		public state: IGameBossState
	) {
		super(GameObjectType.BOSS, state)
	}

}
