import {IZoneDimensions}       from '../../game-state/Zone'
import {ITradeDealAttributes}  from '../container/TradeDeal'
import {IGameObjectAttributes} from '../GameObject'
import {IChatMessageResponse}  from './data'

export interface ITradeDealUpdates {
	[playerId: number]: ITradeDealUpdate
}

export interface IZoneUpdates {
	[playerId: number]: IZoneUpdate[]
}

export interface IChatSecondUpdateResponse {
	messages: IChatMessageResponse[]
	second: number
}

export interface IUpdateResponse {
	chat: IChatSecondUpdateResponse[]
	currentSecond: number
	tradeDeal?: ITradeDealUpdate
	zone: {
		dimensions: IZoneDimensions
		updates: IZoneUpdate[]
	}
}

export type ITradeDealUpdate = ITradeDealAttributes
export type IZoneUpdate = IGameObjectAttributes
