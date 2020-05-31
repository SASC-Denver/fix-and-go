import {
	error,
	IResponse,
	IUpdateResponse
}                      from '@fix-and-go/logic'
import {ChatManager}   from './ChatManager'
import {PlayerManager} from './PlayerManager'
import {TradeManager}  from './TradeManager'
import {ZoneManager}   from './ZoneManager'

export class Coordinator {

	currentSecond = 0

	constructor(
		public chatManager: ChatManager,
		public playerManager: PlayerManager,
		public tradeManager: TradeManager,
		public zoneManager: ZoneManager,
	) {
	}

	getUpdates(
		query: {
			lastUpdateSecond: string
			playerId: string
		}
	): IResponse | IUpdateResponse {
		const lastUpdateSecond = parseInt(query.lastUpdateSecond)
		const playerId         = parseInt(query.playerId)
		// tslint:disable-next-line:use-isnan
		if (playerId === NaN || lastUpdateSecond === NaN) {
			return error('Invalid "Get Updates" input')
		}

		const chat = this.chatManager.recentChat.filter(messagesForSecond => messagesForSecond.second >= lastUpdateSecond)

		// console.log('playerId: ' + playerId)
		const updatesForPlayer         = this.zoneManager.updates[playerId]
		const updates: IUpdateResponse = {
			chat,
			currentSecond: this.currentSecond,
			zone: {
				dimensions: this.zoneManager.testZone.dimensions,
				updates: updatesForPlayer ? updatesForPlayer : []
			}
		}

		const tradeDealUpdate = this.tradeManager.updates[playerId]

		if (tradeDealUpdate) {
			updates.tradeDeal = tradeDealUpdate
		}

		return updates
	}

	trackTime(): void {
		this.zoneManager.update()

		const currentMillisecond = new Date().getTime()
		this.currentSecond       = Math.floor(currentMillisecond / 1000)
		const secondRemainder    = new Date().getTime() % 1000

		this.chatManager.update()

		setTimeout(() => this.trackTime(), 1000 - secondRemainder)
	}

}
