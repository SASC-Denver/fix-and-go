import {
	GameItem,
	GameItemType,
	IEquipmentAttributes
} from '../GameItem'

export enum EquipmentSlot {
	ARM,
	BODY,
	FEET,
	HEAD,
	HOLD,
	LEGS,
	LIGHT,
	WIELD,
}

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
		public equipmentState: IEquipmentState
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

		const equipmentSlotName = this.getEquipmentSlotName(equipmentAttributes.equipmentSlot)

		const equippedItemAttributes = this.equipmentState[equipmentSlotName]
		let unequippedItem: GameItem = null
		if (equippedItemAttributes) {
			unequippedItem = new GameItem(equippedItemAttributes)
		}
		this.equipmentState[equipmentSlotName] = equipmentAttributes

		return {
			success: true,
			unequippedItem
		}
	}

	unequip(
		equipmentSlot: EquipmentSlot
	): GameItem {
		const equipmentSlotName = this.getEquipmentSlotName(equipmentSlot)

		const equippedItemAttributes = this.equipmentState[equipmentSlotName]

		if (!equippedItemAttributes) {
			return null
		}

		this.equipmentState[equipmentSlotName] = null

		return new GameItem(equippedItemAttributes)
	}

	hasEquipmentAtSlot(
		equipmentSlot: EquipmentSlot
	): boolean {
		return this.equipmentState[equipmentSlot] != null
	}

	private getEquipmentSlotName(
		equipmentSlot: EquipmentSlot
	): string {
		switch (equipmentSlot) {
			case EquipmentSlot.ARM:
				return 'arm'
			case EquipmentSlot.BODY:
				return 'body'
			case EquipmentSlot.FEET:
				return 'feet'
			case EquipmentSlot.HEAD:
				return 'head'
			case EquipmentSlot.HOLD:
				return 'hold'
			case EquipmentSlot.LEGS:
				return 'legs'
			case EquipmentSlot.LIGHT:
				return 'light'
			case EquipmentSlot.WIELD:
				return 'wield'
		}
		return null
	}

}
