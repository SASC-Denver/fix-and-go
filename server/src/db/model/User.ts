import {IGamePlayerAttributes} from '@fix-and-go/logic'

export interface IUser {

	attributes?: IGamePlayerAttributes;
	emailHash?: string;
	id?: number;
	passwordHash?: string;
	userId?: number;
	username?: string;

}
