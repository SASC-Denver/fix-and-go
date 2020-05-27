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
	email: string
	password: string
	username: string
}

export interface ISignUpResponse
	extends IResponse {
	attributes: IGamePlayerAttributes
}

export interface ISignInRequest
	extends IRequest {
	email: string
	password: string
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
