import {
	ErrorCode,
	IResponse,
	IResponseError
} from '../model/network/data'

export function error(
	description
): IResponse {
	return {
		error: errorObject(description)
}
}

export function errorObject(
	description
): IResponseError {
	return {
		code: ErrorCode.INVALID_REQUEST,
		description
	}
}
