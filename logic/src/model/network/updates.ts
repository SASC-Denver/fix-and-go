import {IZoneDimensions}       from '../../game-state/Zone'
import {IGameObjectAttributes} from '../GameObject'

export interface IZoneUpdates {
	[playerId: number]: IZoneUpdate[]
}

export interface IUpdateRequest {
	playerId: number
}

export interface IUpdateResponse {
	dimensions: IZoneDimensions
	updates: IZoneUpdate[]
}

export enum ZoneUpdateType {
	MESSAGE,
	ZONE,
}

export interface IZoneUpdate {
	object: IGameObjectAttributes
	type: ZoneUpdateType.ZONE
}
