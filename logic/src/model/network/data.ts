import {
	EquipmentSlot,
	IEquipmentState
}                                 from '../container/Equipment'
import {TradeDealChangeType}      from '../container/TradeDeal'
import {GameObjectType}           from '../game'
import {IGameCharacterStatistics} from '../GameCharacter'
import {
	IGameItemAttributes,
	IGameItemIdentifier
}                                 from '../GameItem'
import {
	IGamePlayerAttributes,
	IGamePlayerState
}                                 from '../GamePlayer'

export enum ErrorCode {
	INVALID_REQUEST,
	REQUESTING_TOO_FREQUENTLY
}

export interface IRequest {
	playerId: number
}

export interface IResponse {
	error?: IResponseError
}

export interface IResponseError {
	code: ErrorCode
	description: string
}

export interface ISignUpRequest
	extends IRequest {
	encodedEmail: string
	encodedPassword: string
	username: string
}

export interface ISignUpResponse
	extends IResponse {
	state: IGamePlayerState
}

export interface ISignInRequest
	extends IRequest {
	encodedEmail: string
	encodedPassword: string
}

export interface ISignInResponse
	extends IResponse {
	state: IGamePlayerState
}

export interface IResetPasswordRequest
	extends IRequest {
	email: string
}

export interface IResetPasswordResponse
	extends IResponse {
}

export interface IChatRequest
	extends IRequest {
	text: string
}

export interface IChatMessageResponse
	extends IResponse {
	id: number
	text: string
	username: string
}

export interface IMoveRequest
	extends IRequest {
	positionChange: {
		x: number,
		y: number
	}
}

export interface IMoveResponse
	extends IResponse {
	newCoords: {
		x: number
		y: number
	}
}

export interface IInventoryRequest
	extends IRequest {
}

export interface IInventoryResponse
	extends IResponse {
	inventoryItems: IGameItemAttributes[]
}

export interface IInspectItemsRequest
	extends IRequest {
}

export interface IInspectItemsResponse
	extends IResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}

export interface IPickUpItemRequest
	extends IRequest {
	id: number
	type: GameObjectType
}

export interface IPickUpItemResponse
	extends IResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}

export interface IDropItemRequest
	extends IRequest {
	id: number
	type: GameObjectType
}

export interface IDropItemResponse
	extends IResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}

export interface ITradeDealStartRequest
	extends IRequest {
	toPlayerId: number
}

export interface ITradeDealRequest
	extends IRequest {
	tradeDealId: number
}

export interface ITradeDealResponse
	extends IResponse {
	tradeDealId: number
}

export interface ITradeDealStartResponse
	extends ITradeDealResponse {
}

export interface ITradeDealReplyRequest
	extends ITradeDealRequest {
	accept: boolean
}

export interface ITradeDealReplyResponse
	extends ITradeDealResponse {
}

export interface ITradeDealChangeRequest
	extends ITradeDealRequest {
	coins?: number;
	item?: IGameItemIdentifier;
	type: TradeDealChangeType;
}

export interface ITradeDealChangeResponse
	extends ITradeDealResponse {
}

export interface ITradeDealCancelRequest
	extends ITradeDealRequest {
}

export interface ITradeDealCancelResponse
	extends ITradeDealResponse {
}

export interface ITradeDealCommitRequest
	extends ITradeDealRequest {
}

export interface ITradeDealCommitResponse
	extends IResponse {
}

export interface IEquipItemRequest
	extends IRequest {
	item?: IGameItemIdentifier;
}

export interface IEquipItemResponse
	extends IResponse {
	attributes: IGamePlayerAttributes
	equipmentState: IEquipmentState
	inventoryItems: IGameItemAttributes[]
	stats: IGameCharacterStatistics
	success: boolean
}

export interface IUnequipItemRequest
	extends IRequest {
	equipmentSlot: EquipmentSlot
}

export interface IUnequipItemResponse
	extends IResponse {
	attributes: IGamePlayerAttributes
	equipmentState: IEquipmentState
	inventoryItems: IGameItemAttributes[]
	stats: IGameCharacterStatistics
	success: boolean
}
