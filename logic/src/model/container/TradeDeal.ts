import {IGameItemAttributes} from '../GameItem'
import {GamePlayer}          from '../GamePlayer'

export enum TradeDealState {
	STARTED,
	IN_PROGRESS,
	COMMITTED
}

export enum TradeDealChangeType {
	ADD_THEIR_ITEM,
	ADD_YOUR_ITEM,
	CHANGE_YOUR_COINS,
	REMOVE_THEIR_ITEM,
	REMOVE_YOUR_ITEM,
}

export interface IExchangeSide {
	coins: number;
	items: IGameItemAttributes[]
}

export interface ITradeDealAttributes {
	id: number
	parties: {
		initiator: {
			id: number
			offer: IExchangeSide
			username: string
		}
		receiver?: {
			id: number
			offer: IExchangeSide
			username: string
		}
	}
	state: TradeDealState
	storeInventory?: IGameItemAttributes[]
}

export class TradeDeal {

	parties: {
		initiator: GamePlayer
		receiver: GamePlayer
	}

	attributes: ITradeDealAttributes

	constructor(
		id: number,
		initiator: GamePlayer,
		receiver?: GamePlayer
	) {
		this.parties = {
			initiator,
			receiver
		}

		this.attributes = {
			id,
			parties: {
				initiator: {
					id: initiator.attributes.id,
					offer: {
						coins: 0,
						items: []
					},
					username: initiator.attributes.username
				},
				receiver: {
					id: receiver.attributes.id,
					offer: {
						coins: 0,
						items: []
					},
					username: receiver.attributes.username
				}
			},
			state: TradeDealState.STARTED
		}
	}

}
