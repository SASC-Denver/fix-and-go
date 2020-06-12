import {
	IZoneAttributes,
	Zone
}                       from '../game-state/Zone'
import {
	EquipmentModifierType,
	EquipmentSlot,
	IEquipmentArmorModifier,
	IEquipmentAttackBonusModifier,
	IEquipmentAttackModifier,
	IEquipmentLightModifier,
	IEquipmentModifier
}                       from '../model/container/Equipment'
import {GameObjectType} from '../model/game'
import {
	GameItemType,
	IGameItemAttributes
}                       from '../model/GameItem'

export const starterPack: Array<{
	equipmentSlot: EquipmentSlot,
	itemType: GameItemType,
	modifiers: IEquipmentModifier[],
	name: string
}> = [{
	equipmentSlot: 'head',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 2,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Leather Helmet'
}, {
	equipmentSlot: 'feet',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 2,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Leather Boots'
}, {
	equipmentSlot: 'body',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 4,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Leather Armor'
}, {
	equipmentSlot: 'legs',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 2,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Leather Leggings'
}, {
	equipmentSlot: 'wield',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		diceSides: 5,
		numberOfDice: 3,
		type: EquipmentModifierType.ATTACK
	} as IEquipmentAttackModifier, {
		attackBonus: 2,
		type: EquipmentModifierType.ATTACK_BONUS
	} as IEquipmentAttackBonusModifier],
	name: 'Broadsword'
}, {
	equipmentSlot: 'hold',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 3,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Wooden Shield'
}, {
	equipmentSlot: 'light',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		sightRange: 1,
		type: EquipmentModifierType.LIGHT
	} as IEquipmentLightModifier],
	name: 'Torch'
}, {
	equipmentSlot: 'arm',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 1,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Brass Wrist Guard'
}]

export const debugPack: Array<{
	equipmentSlot: EquipmentSlot,
	itemType: GameItemType,
	modifiers: IEquipmentModifier[],
	name: string
}> = [{
	equipmentSlot: 'head',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 3,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Iron Helmet'
}, {
	equipmentSlot: 'feet',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 3,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Studded Boots'
}, {
	equipmentSlot: 'body',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 5,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Studded Armor'
}, {
	equipmentSlot: 'legs',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 3,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Studded Leggings'
}, {
	equipmentSlot: 'wield',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		diceSides: 7,
		numberOfDice: 3,
		type: EquipmentModifierType.ATTACK
	} as IEquipmentAttackModifier, {
		attackBonus: 3,
		type: EquipmentModifierType.ATTACK_BONUS
	} as IEquipmentAttackBonusModifier],
	name: 'Katana'
}, {
	equipmentSlot: 'hold',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 5,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Steel Shield'
}, {
	equipmentSlot: 'light',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		sightRange: 1,
		type: EquipmentModifierType.LIGHT
	} as IEquipmentLightModifier],
	name: 'Torch'
}, {
	equipmentSlot: 'arm',
	itemType: GameItemType.EQUIPMENT,
	modifiers: [{
		armorClass: 3,
		type: EquipmentModifierType.ARMOR
	} as IEquipmentArmorModifier],
	name: 'Steel Wrist Guard'
}]


const items: IGameItemAttributes[] = []

export function addEquipmentPack(
	anItemPack: Array<{
		equipmentSlot: EquipmentSlot,
		itemType: GameItemType,
		name: string
	}>,
	// coordinates: IObjectCoordinates
): IGameItemAttributes[] {
	const itemAttributes: IGameItemAttributes[] = []
	anItemPack.forEach(itemProperties => {
		itemAttributes.push({
			id: Zone.lastObjectId++,
			...itemProperties,
			// coordinates: {
			// 	...coordinates
			// },
			itemType: GameItemType.EQUIPMENT,
			type: GameObjectType.ITEM
		})
	})

	return itemAttributes
}

export const testZoneAttributes: IZoneAttributes = {
	bosses: [{
		attributes: {
			coordinates: {
				x: 7,
				y: 6,
			},
			maxHealth: 100,
			maxEnergy: 100,
		},
		coins: 10,
		inventoryItems: [],
		stats: {
			armorClass: 15,
			attack: {
				diceSides: 5,
				numberOfDice: 3,
			},
			attackBonus: 2,
			sightRange: 1
		}
	}],
	dimensions: {
		x: 15,
		y: 15,
	},
	items,
	obstacles: [{
		coordinates: {
			x: 0,
			y: 0,
		}
	}, {
		coordinates: {
			x: 10,
			y: 0,
		}
	}, {
		coordinates: {
			x: 4,
			y: 6,
		}
	}, {
		coordinates: {
			x: 3,
			y: 6,
		}
	}, {
		coordinates: {
			x: 4,
			y: 7,
		}
	}, {
		coordinates: {
			x: 3,
			y: 7,
		}
	}, {
		coordinates: {
			x: 4,
			y: 8,
		}
	}, {
		coordinates: {
			x: 3,
			y: 8,
		}
	}, {
		coordinates: {
			x: 4,
			y: 9,
		}
	}, {
		coordinates: {
			x: 3,
			y: 9,
		}
	}, {
		coordinates: {
			x: 0,
			y: 14,
		}
	}, {
		coordinates: {
			x: 14,
			y: 0,
		}
	}, {
		coordinates: {
			x: 14,
			y: 14,
		}
	}],
	portals: [{
		coordinates: {
			x: 5,
			y: 0,
		}
	}],
	stores: [{
		coordinates: {
			x: 0,
			y: 4,
		}
	}]
}
