import {
  IGameObject,
  IObjectCoordinates,
  IObjectDirectoryById,
} from "../model/game";

/*
	Represents the state of the a zone in the game.  Game consists of multiple
	zones between which players move.
 */
export class Zone {
  /*
	Two dimensional array of references to objects in the zone,
	with array indexes being the X and Y coordinates.
	 */
  public objectLayout: IGameObject[][] = [];

  /*
	Directory (map) of all objects by ObjectType and Id
	 */
  private objectsDirectory: IObjectDirectoryById = {};

  /**
   * Zones are rectangles with coordinates from 0 to endX and 0 to endY
   *
   * @param endX - end X coordinate
   * @param endY - end Y coordinate
   */
  constructor(private endX: number, private endY: number) {
    for (let y = 0; y < endY; y++) {
      this.objectLayout[y] = [];
      for (let x = 0; x < endX; x++) {
        this.objectLayout[y][x] = null;
      }
    }
  }

  /**
   * Add object to a zone.
   *
   * @param object   object to add
   * @param x   new X coordinates of the object
   * @param y   new Y coordinates of the object
   *
   * @return true if object was added, false otherwise
   */
  add(object: IGameObject, x: number, y: number): boolean {
    if (!object || this.objectLayout[y][x]) {
      return;
    }

    object.coordinates = {
      x,
      y,
    };
    this.objectLayout[y][x] = object;
  }

  /**
   * Remove object from a zone.
   *
   * @param gameObjectId   Id of the object to remove
   *
   * @return true if object was added, false otherwise
   */
  remove(gameObjectId: number): boolean {
    throw new Error("Not implemented");
  }

  /**
   * Move object in a zone.
   *
   * @param gameObjectType  Type of Game Object (GameObjectType)
   * @param gameObjectId  Id of Game Object
   * @param changeInX  (-1, 0, 1)
   * @param changeInY  (-1, 0, 1)
   *
   * @return new Coordinates of the object
   */
  move(
    gameObjectType: string,
    gameObjectId: number,
    changeInX: number,
    changeInY: number
  ): IObjectCoordinates {
    throw new Error("Not implemented");
  }

  /**
   * Move object in a zone.
   *
   * @param object  Game Object to move
   * @param newX  New X position of object
   * @param newY  New Y position of object
   *
   * @return new Coordinates of the object
   */
  moveObject(object: IGameObject, newX: number, newY: number): boolean {
    if (newX < 0 || newY < 0) {
      return false;
    }
    if (newX >= this.endX || newY >= this.endY) {
      return false;
    }
    if (this.objectLayout[newY][newX]) {
      return false;
    }
    
    if(this.objectLayout[object.coordinates.y][object.coordinates.x]
    !== object) {
    	return false;
    }
    
    this.objectLayout[object.coordinates.y][object.coordinates.x] = null;
    this.objectLayout[newY][newX] = object;

    object.coordinates = {
      x: newX,
      y: newY,
    };

    return true;
  }
}
