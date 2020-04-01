import {
	GameObjectType,
	IGameObject,
	IObjectCoordinates
}                  from './game'
import {Inventory} from './Inventory'

/**
 * Any game character, including Player or Boss
 */
export class GameCharacter
	implements IGameObject {

	coordinates: IObjectCoordinates
	type: GameObjectType

	inventory: Inventory

	maxHealth: number
	maxPoints: number

	health: number
	points: number

	constructor() {
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