import {IZoneAttributes} from '../game-state/Zone'
import {EquipmentSlot}   from '../model/container/Equipment'
import {
	GameObjectType,
	IObjectCoordinates
}                        from '../model/game'
import {
	GameItemType,
	IGameItemAttributes
}                        from '../model/GameItem'

const fighterPack = [{
	equipmentSlot: EquipmentSlot.HEAD,
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Helmet'
}, {
	equipmentSlot: EquipmentSlot.FEET,
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Boots'
}, {
	equipmentSlot: EquipmentSlot.BODY,
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Armor'
}, {
	equipmentSlot: EquipmentSlot.LEGS,
	itemType: GameItemType.EQUIPMENT,
	name: 'Leather Leggings'
}, {
	equipmentSlot: EquipmentSlot.WIELD,
	itemType: GameItemType.EQUIPMENT,
	name: 'Broadsword'
}, {
	equipmentSlot: EquipmentSlot.HOLD,
	itemType: GameItemType.EQUIPMENT,
	name: 'Wooden Shield'
}, {
	equipmentSlot: EquipmentSlot.LIGHT,
	itemType: GameItemType.EQUIPMENT,
	name: 'Torch'
}, {
	equipmentSlot: EquipmentSlot.ARM,
	itemType: GameItemType.EQUIPMENT,
	name: 'Brass Bracelet'
}]

const items: IGameItemAttributes[] = []

function addItemPack(
	anItemPack: Array<{
		equipmentSlot: EquipmentSlot,
		itemType: GameItemType,
		name: string
	}>,
	coordinates: IObjectCoordinates
): void {
	anItemPack.forEach(itemProperties => {
		items.push({
			...itemProperties,
			coordinates: {
				...coordinates
			},
			type: GameObjectType.ITEM
		})
	})
}

addItemPack(fighterPack, {
	x: 1,
	y: 8
})
addItemPack(fighterPack, {
	x: 2,
	y: 8
})
addItemPack(fighterPack, {
	x: 1,
	y: 9
})
addItemPack(fighterPack, {
	x: 2,
	y: 9
})
addItemPack(fighterPack, {
	x: 1,
	y: 10
})
addItemPack(fighterPack, {
	x: 2,
	y: 10
})
addItemPack(fighterPack, {
	x: 1,
	y: 11
})
addItemPack(fighterPack, {
	x: 2,
	y: 11
})
addItemPack(fighterPack, {
	x: 1,
	y: 12
})
addItemPack(fighterPack, {
	x: 2,
	y: 12
})
addItemPack(fighterPack, {
	x: 1,
	y: 13
})
addItemPack(fighterPack, {
	x: 2,
	y: 13
})

addItemPack(fighterPack, {
	x: 7,
	y: 8
})
addItemPack(fighterPack, {
	x: 8,
	y: 8
})
addItemPack(fighterPack, {
	x: 7,
	y: 9
})
addItemPack(fighterPack, {
	x: 8,
	y: 9
})
addItemPack(fighterPack, {
	x: 7,
	y: 10
})
addItemPack(fighterPack, {
	x: 8,
	y: 10
})
addItemPack(fighterPack, {
	x: 7,
	y: 11
})
addItemPack(fighterPack, {
	x: 8,
	y: 11
})
addItemPack(fighterPack, {
	x: 7,
	y: 12
})
addItemPack(fighterPack, {
	x: 8,
	y: 12
})
addItemPack(fighterPack, {
	x: 7,
	y: 13
})
addItemPack(fighterPack, {
	x: 8,
	y: 13
})
addItemPack(fighterPack, {
	x: 9,
	y: 8
})
addItemPack(fighterPack, {
	x: 10,
	y: 8
})
addItemPack(fighterPack, {
	x: 9,
	y: 9
})
addItemPack(fighterPack, {
	x: 10,
	y: 9
})
addItemPack(fighterPack, {
	x: 9,
	y: 10
})
addItemPack(fighterPack, {
	x: 10,
	y: 10
})
addItemPack(fighterPack, {
	x: 9,
	y: 11
})
addItemPack(fighterPack, {
	x: 10,
	y: 11
})
addItemPack(fighterPack, {
	x: 9,
	y: 12
})
addItemPack(fighterPack, {
	x: 10,
	y: 12
})
addItemPack(fighterPack, {
	x: 9,
	y: 13
})
addItemPack(fighterPack, {
	x: 10,
	y: 13
})

addItemPack(fighterPack, {
	x: 11,
	y: 8
})
addItemPack(fighterPack, {
	x: 12,
	y: 8
})
addItemPack(fighterPack, {
	x: 11,
	y: 9
})
addItemPack(fighterPack, {
	x: 12,
	y: 9
})
addItemPack(fighterPack, {
	x: 11,
	y: 10
})
addItemPack(fighterPack, {
	x: 12,
	y: 10
})
addItemPack(fighterPack, {
	x: 11,
	y: 11
})
addItemPack(fighterPack, {
	x: 12,
	y: 11
})
addItemPack(fighterPack, {
	x: 11,
	y: 12
})
addItemPack(fighterPack, {
	x: 12,
	y: 12
})
addItemPack(fighterPack, {
	x: 11,
	y: 13
})
addItemPack(fighterPack, {
	x: 12,
	y: 13
})

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
