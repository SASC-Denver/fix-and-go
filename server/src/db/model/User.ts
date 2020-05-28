import {IGamePlayerAttributes} from '@fix-and-go/logic'

export interface IUser {

	attributes?: IGamePlayerAttributes;
	encodedEmail?: string;
	id?: number;
	encodedPassword?: string;
	userId?: number;
	username?: string;

}
