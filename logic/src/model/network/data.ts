import {GameObjectType}        from '../game'
import {IGameItemAttributes}   from '../GameItem'
import {IGamePlayerAttributes} from '../GamePlayer'

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
	attributes: IGamePlayerAttributes
}

export interface ISignInRequest
	extends IRequest {
	encodedEmail: string
	encodedPassword: string
}

export interface ISignInResponse
	extends IResponse {
	attributes: IGamePlayerAttributes
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

export interface IChatMessageResponse {
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

export interface IInventoryResponse {
	inventory: IGameItemAttributes[]
}

export interface IInspectItemsRequest
	extends IRequest {
}

export interface IInspectItemsResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}

export interface IPickUpItemRequest
	extends IRequest {
	id: number
	type: GameObjectType
}

export interface IPickUpItemResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}

export interface IDropItemRequest
	extends IRequest {
	id: number
	type: GameObjectType
}

export interface IDropItemResponse {
	inventory: IGameItemAttributes[]
	zoneItems: IGameItemAttributes[]
}
