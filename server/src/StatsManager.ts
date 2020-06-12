import {
	EquipmentModifierType,
	GameItem,
	GamePlayer,
	IEquipmentArmorModifier,
	IEquipmentAttackBonusModifier,
	IEquipmentAttackModifier,
	IEquipmentAttributes,
	IEquipmentLightModifier
} from '@fix-and-go/logic'

export class StatsManager {

	onEquipmentAdd(
		player: GamePlayer,
		addedEquipment: GameItem,
		removedEquipment: GameItem
	): void {
		if (removedEquipment) {
			this.removeEquipment(player, removedEquipment.attributes as IEquipmentAttributes)
		}
		this.addEquipment(player, addedEquipment.attributes as IEquipmentAttributes)
	}

	onEquipmentRemove(
		player: GamePlayer,
		removedEquipment: GameItem
	): void {
		this.removeEquipment(player, removedEquipment.attributes as IEquipmentAttributes)
	}

	private addEquipment(
		player: GamePlayer,
		equipmentAttributes: IEquipmentAttributes
	): void {
		equipmentAttributes.modifiers.forEach(modifier => {
			switch (modifier.type) {
				case EquipmentModifierType.ARMOR: {
					const armorModifier = modifier as IEquipmentArmorModifier
					player.state.stats.armorClass += armorModifier.armorClass
					return
				}
				case EquipmentModifierType.ATTACK: {
					const attackModifier                = modifier as IEquipmentAttackModifier
					player.state.stats.attack.diceSides = attackModifier.diceSides
					player.state.stats.attack.numberOfDice = attackModifier.numberOfDice
					return
				}
				case EquipmentModifierType.ATTACK_BONUS: {
					const attackBonusModifier = modifier as IEquipmentAttackBonusModifier
					player.state.stats.attackBonus += attackBonusModifier.attackBonus
					return
				}
				case EquipmentModifierType.LIGHT: {
					const lightModifier           = modifier as IEquipmentLightModifier
					player.state.stats.sightRange = lightModifier.sightRange
					return
				}
			}
		})
	}

	private removeEquipment(
		player: GamePlayer,
		equipmentAttributes: IEquipmentAttributes
	): void {
		equipmentAttributes.modifiers.forEach(modifier => {
			switch (modifier.type) {
				case EquipmentModifierType.ARMOR: {
					const armorModifier = modifier as IEquipmentArmorModifier
					player.state.stats.armorClass -= armorModifier.armorClass
					return
				}
				case EquipmentModifierType.ATTACK: {
					// const attackModifier                = modifier as IEquipmentAttackModifier
					player.state.stats.attack.diceSides = 5
					player.state.stats.attack.numberOfDice = 1
					return
				}
				case EquipmentModifierType.ATTACK_BONUS: {
					const attackBonusModifier = modifier as IEquipmentAttackBonusModifier
					player.state.stats.attackBonus -= attackBonusModifier.attackBonus
					return
				}
				case EquipmentModifierType.LIGHT: {
					// const lightModifier           = modifier as IEquipmentLightModifier
					player.state.stats.sightRange = 0
					return
				}
			}
		})
	}

}
