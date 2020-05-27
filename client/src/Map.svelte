<script>
    import {GameObjectType,} from '@fix-and-go/logic'
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'

    const dispatch = createEventDispatcher();

    export let changeCount = 0;
    export let player;
    export let zone;

    $: mapView = getMapView(zone, player, changeCount);

    onMount(() => {
    });

    onDestroy(() => {
    });

    function render(
        gameObject
    ) {
        if (gameObject === undefined) {
            return '---------';
        } else if (gameObject === null) {
            return '';
        }

        switch (gameObject.attributes.type) {
            case GameObjectType.BOSS:
                return 'Boss' + getCoords(gameObject);
            case GameObjectType.ITEM:
                return 'Item' + getCoords(gameObject);
            case GameObjectType.OBSTACLE:
                return '^^^^^^' + getCoords(gameObject);
            case GameObjectType.PLAYER:
                return gameObject.attributes.username + getCoords(gameObject);
            case GameObjectType.PORTAL:
                return 'Portal' + getCoords(gameObject);
            case GameObjectType.STORE:
                return 'Store' + getCoords(gameObject);
            default:
                return '?????';
        }
    }

    function getCoords(
        gameObject
    ) {
        return '';

        // const coords = gameObject.coordinates;
        // return ' X: ' + coords.x + ', Y: ' + coords.y;
    }

    function handleClick(
        viewX,
        viewY
    ) {
        // console.log('viewX: ' + viewX + ', viewY: ' + viewY);
        let changeInY;
        switch (viewY) {
            case 4:
                changeInY = -1;
                break;
            case 5:
                changeInY = 0;
                break;
            case 6:
                changeInY = 1;
                break;
            default:
                return;
        }
        let changeInX;
        switch (viewX) {
            case 4:
                changeInX = -1;
                break;
            case 5:
                changeInX = 0;
                break;
            case 6:
                changeInX = 1;
                break;
            default:
                return;
        }

        if (changeInX === 0 && changeInY === 0) {
            // That's where the Player is
            return;
        }
        // console.log('changeInX: ' + changeInX + ', changeInY: ' + changeInY);

        let newX = player.attributes.coordinates.x + changeInX;
        let newY = player.attributes.coordinates.y + changeInY;

        if (zone.isMoveWithinDimensions(newX, newY)) {
            dispatch('move', {
                positionChange: {
                    x: changeInX,
                    y: changeInY
                }
            })
        }
    }

    function getMapView(
        zone,
        player
    ) {
        const view = [];
        for (let y = 0; y < 11; y++) {
            view[y] = [];
        }

        if (!zone || !player) {
            return view;
        }
        const coordinates = player.attributes.coordinates;

        const leftBorder = coordinates.x - 5;
        const rightBorder = coordinates.x + 5;

        const topBorder = coordinates.y - 5;
        const bottomBorder = coordinates.y + 5;

        let viewX;
        let viewY = 0;
        for (let y = topBorder; y <= bottomBorder; y++) {
            viewX = 0;
            for (let x = leftBorder; x <= rightBorder; x++) {
                try {
                    if (x < 0 || y < 0) {
                        view[viewY][viewX] = undefined;
                        continue;
                    }
                    if (y >= zone.objectLayout.length) {
                        view[viewY][viewX] = undefined;
                        continue;
                    }
                    const zoneObjectRow = zone.objectLayout[y];
                    if (x >= zoneObjectRow.length) {
                        view[viewY][viewX] = undefined;
                        continue;
                    }

                    const gameObject = zone.objectLayout[y][x];

                    if(gameObject) {
                        view[viewY][viewX] = gameObject;
                    } else {
                        const gameItems = zone.itemLayout[y][x];
                        if(gameItems.length) {
                            view[viewY][viewX] = gameItems[0];
                        } else {
                            view[viewY][viewX] = null;
                        }
                    }
                } finally {
                    viewX++;
                }
            }
            viewY++;
        }

        return view;
    }
</script>
<style>
    .map {
        border-collapse: collapse;
    }

    .map td {
        padding: 0;
    }

    .map td div {
        align-content: center;
        display: flex;
        flex-direction: column;
        height: 50px;
        justify-content: center;
        overflow: hidden;
        text-align: center;
        word-break: break-all;
    }
</style>

<table class="map">
    {#each mapView as mapViewRow, viewY}
    <tr>
        {#each mapViewRow as mapObject, viewX}
        <td on:click="{event => handleClick(viewX, viewY)}">
            <div>
                {render(mapObject)}
            </div>
            <!--x{viewX}, y{viewY}-->
        </td>
        {/each}
    </tr>
    {/each}
</table>
