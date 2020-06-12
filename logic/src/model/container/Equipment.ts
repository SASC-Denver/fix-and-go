import {
	GameItem,
	GameItemType,
	IGameItemAttributes
} from '../GameItem'

export type EquipmentSlot =
	'arm' | 'body' | 'feet' | 'head' | 'hold' | 'legs' | 'light' | 'wield'

export interface IEquipmentState {
	arm: IEquipmentAttributes;
	body: IEquipmentAttributes;
	feet: IEquipmentAttributes;
	head: IEquipmentAttributes;
	hold: IEquipmentAttributes;
	legs: IEquipmentAttributes;
	light: IEquipmentAttributes;
	wield: IEquipmentAttributes;
}

export interface IEquipmentAttributes
	extends IGameItemAttributes {
	equipmentSlot: EquipmentSlot
	modifiers: IEquipmentModifier[]
}

export enum EquipmentModifierType {
	ARMOR,
	ATTACK,
	ATTACK_BONUS,
	ENERGY_BONUS,
	HEALTH_BONUS,
	LIGHT
}

export interface IEquipmentModifier {
	type: EquipmentModifierType
}

export interface IEquipmentArmorModifier
	extends IEquipmentModifier {
	armorClass: number
}

export interface IEquipmentAttackModifier
	extends IEquipmentModifier {
	diceSides: number
	numberOfDice: number
}

export interface IEquipmentAttackBonusModifier
	extends IEquipmentModifier {
	attackBonus: number
}

export interface IEquipmentLightModifier
	extends IEquipmentModifier {
	sightRange: number
}

export class Equipment {

	static ensureEquipmentState(
		equipmentState: IEquipmentState
	): IEquipmentState {
		if (!equipmentState) {
			return {
				arm: null,
				body: null,
				feet: null,
				head: null,
				hold: null,
				legs: null,
				light: null,
				wield: null
			}
		}

		return equipmentState
	}

	constructor(
		private equipmentState: IEquipmentState
	) {
	}

	equip(
		item: GameItem
	): {
		success: boolean,
		unequippedItem?: GameItem
	} {
		const equipmentAttributes = item.attributes as IEquipmentAttributes

		if (equipmentAttributes.itemType !== GameItemType.EQUIPMENT) {
			return {
				success: false
			}
		}

		const equippedItemAttributes = this.equipmentState[equipmentAttributes.equipmentSlot]
		let unequippedItem: GameItem = null
		if (equippedItemAttributes) {
			unequippedItem = new GameItem(equippedItemAttributes)
		}
		this.equipmentState[equipmentAttributes.equipmentSlot] = equipmentAttributes

		return {
			success: true,
			unequippedItem
		}
	}

	unequip(
		equipmentSlot: EquipmentSlot
	): GameItem {

		const equippedItemAttributes = this.equipmentState[equipmentSlot]

		if (!equippedItemAttributes) {
			return null
		}

		this.equipmentState[equipmentSlot] = null

		return new GameItem(equippedItemAttributes)
	}

	hasEquipmentAtSlot(
		equipmentSlot: EquipmentSlot
	): boolean {
		return this.equipmentState[equipmentSlot] != null
	}

}
