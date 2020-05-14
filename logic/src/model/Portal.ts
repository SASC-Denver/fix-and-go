import { GameObjectType } from "./game";
import { GameObject, IGameObjectAttributes } from "./GameObject";

export interface IPortalAttributes extends IGameObjectAttributes {}

/**
 * Any game character, including Player or Boss
 */
export class Portal extends GameObject {
  constructor(attributes: IPortalAttributes) {
    super(GameObjectType.PORTAL, attributes);
  }
}
