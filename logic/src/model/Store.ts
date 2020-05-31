/**
 * A place where a player can buy and sell things from.
 */
import {
	GameObjectType,
	IGameObject
}                  from './game'
import {
	GameObject,
	IGameObjectAttributes
}                  from './GameObject'
import {Inventory} from './container/Inventory'

export interface IStoreAttributes
	extends IGameObjectAttributes {
	type?: GameObjectType.STORE
}

/**
 * Store containing items that a player can buy or sell.
 */
export class Store
	extends GameObject {

	attributes: IStoreAttributes
	inventory: Inventory

	constructor(
		attributes: IStoreAttributes,
	) {
		super(GameObjectType.STORE, attributes)
	}

	/**
	 * Buy an item from a store.
	 *
	 * @param id  Id of the object to buy.
	 * @param money  Money in the amount of the price of the item.
	 *
	 * @return
	 */
	buyItem(
		id: number,
		money: number
	): IGameObject {
		throw new Error('Not implemented')
	}

	/**
	 * Sell an item to a store.
	 *
	 * @param  gameObject Object to sell.
	 *
	 * @return  Money in the amount of the price of the item.
	 */
	sellItem(gameObject: IGameObject): number {
		throw new Error('Not implemented')
	}
}
