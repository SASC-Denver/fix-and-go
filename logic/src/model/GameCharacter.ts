import {
	GameObjectType,
	IObjectCoordinates
}                  from './game'
import {GameObject} from './GameObject'
import {Inventory} from './Inventory'

/**
 * Any game character, including Player or Boss
 */
export class GameCharacter
	extends GameObject {

	inventory: Inventory = new Inventory();

	health: number = 0;
	points: number = 0;

	constructor(
		type: GameObjectType,
		public maxHealth: number,
		public maxPoints: number,
	) {
		super(type);
		this.health = maxHealth;
		this.points = maxPoints;
		//
	}

	/**
	 * Attack a particular character
	 *
	 * @param characterToAttack  The character to attack.
	 */
	attack(
		characterToAttack: GameCharacter
	): boolean {
		throw new Error('Not implemented')
	}

}
