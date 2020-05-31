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
	exchange: {
		initiator: IExchangeSide
		receiver: IExchangeSide
	}
	id: number
	initiatorId: number
	receiverId?: number
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
			exchange: {
				initiator: {
					coins: 0,
					items: []
				},
				receiver: {
					coins: 0,
					items: []
				},
			},
			id,
			initiatorId: initiator.attributes.id,
			receiverId: initiator.attributes.id,
			state: TradeDealState.STARTED
		}
	}

}
