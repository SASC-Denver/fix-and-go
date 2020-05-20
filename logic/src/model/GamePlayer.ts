import {GameObjectType} from './game'
import {
	GameCharacter,
	IGameCharacterAttributes
}                       from './GameCharacter'

export interface IGamePlayerAttributes
	extends IGameCharacterAttributes {
	id: number
	username: string
}

/**
 * Human player.
 */
export class GamePlayer
	extends GameCharacter {

	id: number
	username: string

	constructor(
		attributes: IGamePlayerAttributes
	) {
		super(GameObjectType.PLAYER, attributes)

		this.id = attributes.id
		this.username = attributes.username
	}

}
