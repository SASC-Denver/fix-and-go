<script>
    import {GamePlayer, testZoneAttributes, Zone} from '@fix-and-go/logic'
    import {onDestroy, onMount} from 'svelte'
    import Chat from './Chat.svelte'
    import Equipment from './Equipment.svelte'
    import Events from './Events.svelte'
    import Inventory from './Inventory.svelte'
    import Map from './Map.svelte'
    import Stats from './Stats.svelte'
    import {lastMessage} from "./ui-state";
    // import TextToast from './shell/TextToast.svelte'

    let changeCount = 0
    let eventCount = 0
    let testZone
    let player

    onMount(async () => {
        testZone = new Zone(testZoneAttributes);
        signIn().then(playerAttributes => {
            if(!playerAttributes) {
                return;
            }
            player = new GamePlayer(playerAttributes);
            testZone.add(player);
        })
        // textToastUnsubscribe = stateOfTextToast.subscribe(
        // 	value => {
        // 		lastTextToast = value
        // 		showTextToast = true
        // 		setTimeout(() => {
        // 			showTextToast = false
        // 		}, value.seconds * 1000)
        // 	})
    })

    onDestroy(() => {
        // textToastUnsubscribe()
    })

    function handleMove(moveEvent) {
        move(moveEvent.detail.positionChange).then()
    }

    async function signIn() {
        let data
        try {
            return await putData('http://localhost:8080/signIn', {
                username: 'Player' + Math.floor(Math.random() * Math.floor(1000))
            });
        } catch (e) {
            lastMessage.set({
                eventId: ++eventCount,
                value: 'Server not responding, please (re)start the server and reload this page.'
            });
            return null;
        }
    }

    async function move(positionChange) {
        let data = null
        try {
            data = await putData('http://localhost:8080/move', {
                playerId: player.id,
                positionChange
            });
        } catch (e) {
            lastMessage.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
            return;
        }
        if (data.error) {
            lastMessage.set({
                eventId: ++eventCount,
                value: data.error.description
            });
            return;
        }
        testZone.moveObject(player, data.newCoords.x, data.newCoords.y, false);
        changeCount++;
    }

    async function putData(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
</script>

<style>
    header {
        clear: both;
        margin: auto;
        width: 1150px;
    }

    main {
        float: right;
        width: calc(100% - 301px);
    }

    .actions {
        float: right;
    }

    .info {
        float: left;
        width: 300px;
    }

    .middle {
        clear: both;
        margin: auto;
        width: 1150px;
    }

    .middle-left {
        float: left;
        width: calc(100% - 283px);
    }

    .middle-right {
        float: right;
        width: 282px;
    }

    .stats {
        float: left;
    }

    .stats td {
        width: 325px;
    }
</style>

<header>
    <div class="stats">
        <table>
            <tr>
                <td>
                    <Stats></Stats>
                </td>
                <td></td>
            </tr>
        </table>
    </div>
    <div class="actions">
        <table>
            <tr>
                <td>Attack</td>
                <td>PickUp</td>
                <td> ...</td>
                <td> ...</td>
                <td> ...</td>
            </tr>
        </table>
    </div>
</header>
<section class="middle">
    <aside class="info">
        <Chat></Chat>
        <br>
        <br>
        <Events></Events>
    </aside>
    <main>
        <section class="middle-left">
            <Map
                    on:move={handleMove}
                    changeCount={changeCount}
                    player={player}
                    zone={testZone}
            ></Map>
        </section>
        <aside class="middle-right">
            <br>
            <Equipment></Equipment>
            <br>
            <Inventory></Inventory>
        </aside>
    </main>
</section>
