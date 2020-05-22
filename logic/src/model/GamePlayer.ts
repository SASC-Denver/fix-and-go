import {GameObjectType} from './game'
import {
	GameCharacter,
	IGameCharacterAttributes
}                       from './GameCharacter'

export interface IGamePlayerAttributes
	extends IGameCharacterAttributes {
	type?: GameObjectType.PLAYER
	username: string
}

/**
 * Human player.
 */
export class GamePlayer
	extends GameCharacter {

	attributes: IGamePlayerAttributes

	lastSecondOf: {
		move: number
	} = {
		move: 0
	}

	constructor(
		attributes: IGamePlayerAttributes
	) {
		super(GameObjectType.PLAYER, attributes)
	}

}
