import {IZoneDimensions}       from '../../game-state/Zone'
import {IGameObjectAttributes} from '../GameObject'
import {IChatMessageResponse}  from './data'

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
	zone: {
		dimensions: IZoneDimensions
		updates: IZoneUpdate[]
	}
}

export type IZoneUpdate = IGameObjectAttributes
