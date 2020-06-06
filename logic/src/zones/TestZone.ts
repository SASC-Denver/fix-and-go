import {
	IZoneAttributes,
	Zone
}                      from '../game-state/Zone'
import {EquipmentSlot} from '../model/container/Equipment'
import {
	GameObjectType,
	IObjectCoordinates
}                        from '../model/game'
import {
	GameItemType,
	IGameItemAttributes
}                        from '../model/GameItem'

export const starterPack: Array<{
	equipmentSlot: EquipmentSlot,
	itemType: GameItemType,
	name: string
}> = [{
	equipmentSlot: 'head',
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Helmet'
}, {
	equipmentSlot: 'feet',
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Boots'
}, {
	equipmentSlot: 'body',
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Armor'
}, {
	equipmentSlot: 'legs',
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Leggings'
}, {
	equipmentSlot: 'wield',
	itemType: GameItemType.EQUIPMENT,
	name: 'Broadsword'
}, {
	equipmentSlot: 'hold',
	itemType: GameItemType.EQUIPMENT,
	name: 'Wooden Shield'
}, {
	equipmentSlot: 'light',
	itemType: GameItemType.EQUIPMENT,
	name: 'Torch'
}, {
	equipmentSlot: 'arm',
	itemType: GameItemType.EQUIPMENT,
	name: 'Brass Wrist Guard'
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
			maxHealth: 10,
			maxMagic: 10,
		},
		coins: 10,

		inventoryItems: []
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
