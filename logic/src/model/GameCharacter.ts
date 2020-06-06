import {Inventory}           from './container/Inventory'
import {Purse}               from './container/Purse'
import {GameObjectType}      from './game'
import {IGameItemAttributes} from './GameItem'
import {
	GameObject,
	IGameObjectAttributes
}                            from './GameObject'

export interface IGameCharacterState {
	attributes: IGameCharacterAttributes
	inventoryItems: IGameItemAttributes[]
	coins: number
}

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

	inventory: Inventory
	purse: Purse

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
		state: IGameCharacterState,
	) {
		super(type, state.attributes)

		this.inventory = new Inventory(state)
		this.purse     = new Purse(state)

		const attributes = state.attributes

		if (!attributes.health) {
			attributes.health = attributes.maxHealth
		}
		if (!attributes.magic) {
			attributes.magic = attributes.maxMagic
		}
	}

}
