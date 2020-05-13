import {GameCharacter} from './GameCharacter'
import {
	GameObjectType
}                  from './game'

/**
 * In game character.
 */
export class GameBoss
	extends GameCharacter {

	constructor(
		maxHealth: number,
		maxPoints: number,
	) {
		super(GameObjectType.BOSS, maxHealth, maxPoints);
	}



}
