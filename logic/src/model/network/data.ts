import {IGamePlayerAttributes} from '../GamePlayer'

export enum ErrorCode {
	INVALID_REQUEST
}

export interface IRequest {
	playerId: number
}

export interface IResponse {
	error?: IResponseError
}

export interface IResponseError {
	code: ErrorCode
	message: string
}

export interface ISignInRequest
	extends IRequest {
	username: string
}

export interface ISignInResponse
	extends IResponse, IGamePlayerAttributes {
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