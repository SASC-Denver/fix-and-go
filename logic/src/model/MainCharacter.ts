import {GameCharacter} from './GameCharacter'
import {
	GameObjectType
}                  from './game'

/**
 * Human player.
 */
export class MainCharacter
	extends GameCharacter {

	constructor(
		maxHealth: number,
		maxPoints: number,
	) {
		super(GameObjectType.PLAYER, maxHealth, maxPoints);
	}

}
