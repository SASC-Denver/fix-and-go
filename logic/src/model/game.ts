export enum GameObjectType {
	BOSS,
	ITEM,
	MAIN_CHARACTER,
	PLAYER,
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
