export enum GameObjectType {
	BOSS,
	ITEM,
	OBSTACLE,
	PLAYER,
	PORTAL,
	STORE,
}

export interface IGameObject {

	coordinates: IObjectCoordinates
	type: GameObjectType

}

export interface IObjectCoordinates {

	x: number
	y: number

}

/**
 * Directory (map) of objects (by id) with same GameObjectType
 */
export interface IObjectDirectoryById {

	[id: number]: IGameObject

}
