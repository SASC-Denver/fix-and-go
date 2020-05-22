import {IGameObjectAttributes} from './GameObject'

export enum GameObjectType {
	BOSS,
	ITEM,
	OBSTACLE,
	PLAYER,
	PORTAL,
	STORE,
}

export interface IGameObject {

	attributes: IGameObjectAttributes

}

export interface IObjectCoordinates {

	x: number
	y: number

}

export interface IObjectDirectory {

	[type: number]: IObjectDirectoryById

}

/**
 * Directory (map) of objects (by id) with same GameObjectType
 */
export interface IObjectDirectoryById {

	[id: number]: IGameObject

}
