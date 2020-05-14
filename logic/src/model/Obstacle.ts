import { GameObjectType } from "./game";
import { GameObject, IGameObjectAttributes } from "./GameObject";

export interface IObstacleAttributes extends IGameObjectAttributes {}

/**
 * Any game character, including Player or Boss
 */
export class Obstacle extends GameObject {
  constructor(attributes: IObstacleAttributes) {
    super(GameObjectType.OBSTACLE, attributes);
  }
}
