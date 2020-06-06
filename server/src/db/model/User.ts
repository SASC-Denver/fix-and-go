import {IGamePlayerState} from '@fix-and-go/logic'

export interface IUser {

	state?: IGamePlayerState;
	encodedEmail?: string;
	id?: number;
	encodedPassword?: string;
	userId?: number;
	username?: string;

}
