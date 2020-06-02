import {
	ITradeDealAttributes,
	ITradeDealPlayerAttributes,
	TradeDeal
}                   from '../model/container/TradeDeal'
import {GamePlayer} from '../model/GamePlayer'

export function getTradeSide(
	tradeDealAttributes: ITradeDealAttributes,
	yourSide: boolean,
	player: GamePlayer
): ITradeDealPlayerAttributes {
	const initiator = tradeDealAttributes.parties.initiator
	const receiver  = tradeDealAttributes.parties.receiver
	if (player.attributes.id === initiator.id) {
		return yourSide ? initiator : receiver
	}

	return yourSide ? receiver : initiator
}

export function isPlayerTheInitiator(
	tradeDealAttributes: ITradeDealAttributes,
	player: GamePlayer
): boolean {
	const initiator = tradeDealAttributes.parties.initiator
	if (player.attributes.id === initiator.id) {
		return true
	}

	return false
}

export function getOtherTradeSidePlayer(
	tradeDeal: TradeDeal,
	player: GamePlayer
): GamePlayer {
	let otherPlayer = tradeDeal.parties.initiator
	if (isPlayerTheInitiator(tradeDeal.attributes, player)) {
		otherPlayer = tradeDeal.parties.receiver
	}

	return otherPlayer
}
