<script>
    import {
        Game,
        GameBoss,
        GameItem,
        GameObjectType,
        MainCharacter,
        Obstacle,
        Portal,
        Store,
        Zone
    }
    from '@fix-and-go/logic'
    import {
        onDestroy,
        onMount
    }
    from 'svelte'

    var testZone;

    var player;

    var changeCount = 0;

    $: mapView = getMapView(testZone, player, changeCount);

    onMount(() => {
        createTestZone();
    });

    onDestroy(() => {});

    function render(
        gameObject
    ) {
        if (gameObject === undefined) {
            return '---------';
        }
        else if (gameObject === null) {
            return '';
        }

        switch (gameObject.type) {
            case GameObjectType.BOSS:
                return 'Monstr';
            case GameObjectType.ITEM:
                return 'Item';
            case GameObjectType.OBSTACLE:
                return '^^^^^^';
            case GameObjectType.PLAYER:
                return 'Player';
            case GameObjectType.PORTAL:
                return 'Portal';
            case GameObjectType.STORE:
                return 'Store';
            default:
                return '?????';
        }
    }

    function handleClick(
        viewX,
        viewY
    ) {
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

        if (!changeInX && !changeInY) {
            return;
        }

        let newX = player.coordinates.x + changeInX;
        let newY = player.coordinates.y + changeInY;

        if (testZone.moveObject(player, newX, newY)) {
            console.log(JSON.stringify(player.coordinates));
            changeCount++;
        }
    }

    function createTestZone() {
        testZone = new Zone(15, 15);

        player = new MainCharacter(15, 10);

        const boss = new GameBoss(10, 10);

        const item = new GameItem();

        const store = new Store();

        const portal = new Portal();

        const obstacle1 = new Obstacle();
        const obstacle2 = new Obstacle();
        const obstacle3 = new Obstacle();
        const obstacle4 = new Obstacle();
        const obstacle5 = new Obstacle();
        const obstacle6 = new Obstacle();
        const obstacle7 = new Obstacle();
        const obstacle8 = new Obstacle();
        const obstacle9 = new Obstacle();
        const obstacle10 = new Obstacle();
        const obstacle11 = new Obstacle();
        const obstacle12 = new Obstacle();
        const obstacle13 = new Obstacle();

        testZone.add(player, 5, 4);
        testZone.add(boss, 7, 6);
        testZone.add(item, 1, 8);
        testZone.add(store, 0, 4);
        testZone.add(portal, 5, 0);
        testZone.add(obstacle1, 0, 0);
        testZone.add(obstacle2, 10, 0);
        testZone.add(obstacle3, 4, 6);
        testZone.add(obstacle4, 3, 6);
        testZone.add(obstacle5, 4, 7);
        testZone.add(obstacle6, 3, 7);
        testZone.add(obstacle7, 4, 8);
        testZone.add(obstacle8, 3, 8);
        testZone.add(obstacle9, 4, 9);
        testZone.add(obstacle10, 3, 9);
        testZone.add(obstacle11, 0, 14);
        testZone.add(obstacle12, 14, 0);
        testZone.add(obstacle13, 14, 14);
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
        const coordinates = player.coordinates;

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

                    view[viewY][viewX] = zone.objectLayout[y][x];
                }
                finally {
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
</style>

<table class="map">

    {#each mapView as mapViewRow, viewY}
    <tr>
        {#each mapViewRow as mapObject, viewX}
        <td on:click="{event => handleClick(viewX, viewY)}">
            {render(mapObject)}
        </td>
        {/each}
    </tr>
    {/each}
    <!--
    <tr>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
        <td>---------</td>
    </tr>
    <tr>
        <td>---------</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
            Zone
            <br> Gate
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>---------</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Store</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>Player</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>---------</td>
        <td>---------</td>
        <td></td>
        <td></td>
        <td>Monstr</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>---------</td>
        <td>---------</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>Item</td>
        <td></td>
        <td>---------</td>
        <td>---------</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>---------</td>
        <td>---------</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    -->
</table>
