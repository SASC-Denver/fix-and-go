import { GameObjectType, IObjectCoordinates } from "./game";
import { GameObject, IGameObjectAttributes } from "./GameObject";
import { Inventory } from "./Inventory";

export interface IGameCharacterAttributes extends IGameObjectAttributes {
  maxHealth: number;
  maxMagic: number;
}

/**
 * Any game character, including Player or Boss
 */
export class GameCharacter extends GameObject {
  inventory: Inventory = new Inventory();

  health: number = 0;
  magic: number = 0;
  maxHealth: number = 0;
  maxMagic: number = 0;

  constructor(type: GameObjectType, attributes: IGameCharacterAttributes) {
    super(type, attributes);

    this.maxHealth = attributes.maxHealth;
    this.maxMagic = attributes.maxMagic;
    this.health = this.maxHealth;
    this.magic = this.maxMagic;
  }

  /**
   * Attack a particular character
   *
   * @param characterToAttack  The character to attack.
   */
  attack(characterToAttack: GameCharacter): boolean {
    throw new Error("Not implemented");
  }
}
