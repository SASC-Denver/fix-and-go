/**
 * A place where a player can buy and sell things from.
 */
import {
	GameObjectType,
	IGameObject
} from './game'
import {GameObject} from './GameObject'
import {Inventory}   from './Inventory'

/**
 * Store containing items that a player can buy or sell.
 */
export class Store
	extends GameObject {

	inventory: Inventory
	
	constructor() {
		super(GameObjectType.STORE);
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
	sellItem(
		gameObject: IGameObject
	): number {
		throw new Error('Not implemented')
	}

}
