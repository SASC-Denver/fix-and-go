import {
	Equipment,
	IEquipmentState
}                       from './container/Equipment'
import {TradeDeal}      from './container/TradeDeal'
import {GameObjectType} from './game'
import {
	GameCharacter,
	IGameCharacterAttributes,
	IGameCharacterState,
	IGameCharacterStatistics,
} from './GameCharacter'

export interface IGamePlayerState
	extends IGameCharacterState {
	attributes: IGamePlayerAttributes
	equipmentState: IEquipmentState
}

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

	static getDefaultStats(): IGameCharacterStatistics {
		return {
			armorClass: 0,
			attack: {
				diceSides: 5,
				numberOfDice: 1
			},
			attackBonus: 0,
			sightRange: 0,
		}
	}

	lastSecondOf: {
		move: number
	} = {
		move: 0
	}

	tradeDeal: TradeDeal

	equipment: Equipment

	constructor(
		public state: IGamePlayerState
	) {
		super(GameObjectType.PLAYER, state)

		if (!state.equipmentState) {
			state.equipmentState = Equipment.ensureEquipmentState(null)
		}

		if (!state.stats) {
			state.stats = GamePlayer.getDefaultStats()
		}

		this.equipment = new Equipment(
			Equipment.ensureEquipmentState(state.equipmentState))
	}

}
