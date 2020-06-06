import {
	IGameItemAttributes,
	IGameItemIdentifier
}                   from '../GameItem'
import {GamePlayer} from '../GamePlayer'

export enum TradeDealState {
	REQUESTED,
	IN_PROGRESS,
	CANCELLED,
	COMPLETED,
	ARCHIVED
}

export enum TradeDealChangeType {
	ADD_THEIR_ITEM,
	ADD_YOUR_ITEM,
	CHANGE_YOUR_COINS,
	CHANGE_THEIR_COINS,
	REMOVE_THEIR_ITEM,
	REMOVE_YOUR_ITEM,
}

export interface IExchangeSideOffer {
	coins: number;
	committed: boolean;
	items: IGameItemIdentifier[];
}

export interface ITradeDealPlayerAttributes {
	id: number;
	offer: IExchangeSideOffer;
	username: string;
}

export interface ITradeDealAttributes {
	cleanUpIn: number;
	id: number;
	parties: {
		initiator: ITradeDealPlayerAttributes;
		receiver?: ITradeDealPlayerAttributes;
	}
	state: TradeDealState;
	storeInventory?: IGameItemAttributes[];
	version: number;

}

export class TradeDeal {

	attributes: ITradeDealAttributes
	parties: {
		initiator: GamePlayer;
		receiver: GamePlayer;
	}

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
			cleanUpIn: 3,
			id,
			parties: {
				initiator: {
					id: initiator.attributes.id,
					offer: {
						coins: 0,
						committed: false,
						items: []
					},
					username: initiator.state.attributes.username
				},
				receiver: {
					id: receiver.attributes.id,
					offer: {
						coins: 0,
						committed: false,
						items: []
					},
					username: receiver.state.attributes.username
				}
			},
			state: TradeDealState.REQUESTED,
			version: 0
		}
	}

}
