import {TradeDealState} from '../model/container/TradeDeal'
import {GamePlayer}     from '../model/GamePlayer'
import {IResponse}      from '../model/network/data'
import {error}          from './network'

export function tradeDealSave<IR extends IResponse>(
	player: GamePlayer,
	callback: () => IResponse | IR
) {
	let cancelTradeDeal = false
	if (player.tradeDeal) {
		switch (player.tradeDeal.attributes.state) {
			case TradeDealState.STARTED:
				cancelTradeDeal = true
				break
			case TradeDealState.IN_PROGRESS:
			case TradeDealState.COMMITTED:
				return error('Error trade deal in progress')
		}
	}
	try {
		return callback()
	} finally {
		if (cancelTradeDeal) {
			this.coordinator.tradeManager.doTradeDealCancel(player)
		}
	}
}
