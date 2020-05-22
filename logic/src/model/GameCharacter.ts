import {GameObjectType} from './game'
import {
	GameObject,
	IGameObjectAttributes
}                       from './GameObject'
import {Inventory}      from './Inventory'

export interface IGameCharacterAttributes
	extends IGameObjectAttributes {
	health?: number;
	magic?: number;
	maxHealth: number;
	maxMagic: number;
}

/**
 * Any game character, including Player or Boss
 */
export class GameCharacter
	extends GameObject {
	inventory: Inventory = new Inventory()

	attributes: IGameCharacterAttributes

	visionRange: {
		high: {
			x: number;
			y: number;
		}
		low: {
			x: number;
			y: number;
		}
	} = {
		high: {
			x: -1,
			y: -1
		},
		low: {
			x: -1,
			y: -1
		}
	}

	constructor(
		type: GameObjectType,
		attributes: IGameCharacterAttributes
	) {
		super(type, attributes)

		if (!attributes.health) {
			attributes.health = attributes.maxHealth
		}
		if (!attributes.magic) {
			attributes.magic = attributes.maxMagic
		}
	}

	/**
	 * Attack a particular character
	 *
	 * @param characterToAttack  The character to attack.
	 */
	attack(characterToAttack: GameCharacter): boolean {
		throw new Error('Not implemented')
	}

}
