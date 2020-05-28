<script>
    import {ErrorCode, GamePlayer, Zone} from '@fix-and-go/logic'
    import {onDestroy, onMount} from 'svelte'
    import SignIn from './shell/SignIn.svelte'
    import Chat from './Chat.svelte'
    import Equipment from './Equipment.svelte'
    import Events from './Events.svelte'
    import Inventory from './Inventory.svelte'
    import Map from './Map.svelte'
    import Stats from './Stats.svelte'
    import {
        getCredentials,
        lastChatBatch,
        lastMessage,
        setCredentials,
        showSignIn,
        signInError
    } from "./ui-state";
    // import TextToast from './shell/TextToast.svelte'

    let changeCount = 0
    let eventCount = 0
    let lastUpdateSecond = 0
    let player
    let testZone

    onMount(async () => {
        testZone = new Zone();

        const credentials = getCredentials();

        if (credentials) {
            showSignIn.set(false);
            if (!await doSignIn(credentials)) {
                showSignIn.set(true);
            }
        }
        // textToastUnsubscribe = stateOfTextToast.subscribe(
        // 	value => {
        // 		lastTextToast = value
        // 		showTextToast = true
        // 		setTimeout(() => {
        // 			showTextToast = false
        // 		}, value.seconds * 1000)
        // 	})
    })

    function onSignIn(playerAttributes) {
        if (!playerAttributes) {
            return;
        }
        player = new GamePlayer(playerAttributes);
        testZone.add(player);
        updateFromServer().then()
    }

    onDestroy(() => {
        // textToastUnsubscribe()
    })

    function handleMove(moveEvent) {
        move(moveEvent.detail.positionChange).then()
    }

    function handleCreateChatMessage(chatEvent) {
        chat(chatEvent.detail.text).then()
    }

    async function move(positionChange) {
        let data = null
        try {
            data = await putData('api/move', {
                playerId: player.attributes.id,
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
            switch (data.error.code) {
                case ErrorCode.REQUESTING_TOO_FREQUENTLY:
                    // No message needed?
                    return;
            }
            lastMessage.set({
                eventId: ++eventCount,
                value: data.error.description
            });
        }
    }

    async function chat(
        text
    ) {
        let data = null
        try {
            data = await putData('api/chat', {
                playerId: player.attributes.id,
                text
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
        }
    }

    async function updateFromServer() {
        let timestamp = new Date().getTime()
        const secondsBeforeUpdate = Math.floor(timestamp / 1000)

        await getUpdates()

        timestamp = new Date().getTime()
        const secondsAfterUpdate = Math.floor(timestamp / 1000)
        if (secondsAfterUpdate > secondsBeforeUpdate) {
            await updateFromServer()
        } else {
            const milliSecondsAfterUpdate = timestamp % 1000
            setTimeout(async _ => {
                await updateFromServer()
            }, 1000 - milliSecondsAfterUpdate + 1)
        }
    }

    async function getUpdates() {
        let data
        try {
            data = await getData('api/updates?playerId=' + player.attributes.id
                + '&lastUpdateSecond=' + lastUpdateSecond);
            testZone.updateObjects(data.zone.dimensions,
                data.zone.updates,
                player)
            if (data.chat.length) {
                lastChatBatch.set(data.chat);
            }
            lastUpdateSecond = data.currentSecond
            changeCount++
        } catch (e) {
            lastMessage.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
        }
    }

    function signIn(event) {
        doSignIn(event.detail).then()
    }

    async function doSignIn(
        inputData
    ) {
        let data;
        try {
            data = await putData('api/signIn', inputData);
        } catch (e) {
            signInError.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
            return false;
        }
        if (data.error) {
            signInError.set({
                eventId: ++eventCount,
                value: data.error.description
            });
            return false;
        }

        setCredentials(inputData);
        onSignIn(data.attributes);
        showSignIn.set(false);

        return true
    }

    function signUp(event) {
        doSignUp(event.detail).then()
    }

    async function doSignUp(
        inputData
    ) {
        let data;
        try {
            data = await putData('api/signUp', inputData);
        } catch (e) {
            signInError.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
            return false;
        }
        if (data.error) {
            signInError.set({
                eventId: ++eventCount,
                value: data.error.description
            });
            return false;
        }
        setCredentials(inputData);
        onSignIn(data.attributes);
        showSignIn.set(false);

        return true;
    }

    async function getData(url) {
        // console.log('GET: ' + url);
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });
        return response.json();
    }

    async function putData(url, data) {
        // console.log('PUT: ' + url);
        // console.log(JSON.stringify(data, null, 2));
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
                <td
                >PickUp
                </td>
                <td> ...</td>
                <td> ...</td>
                <td> ...</td>
            </tr>
        </table>
    </div>
</header>
<section class="middle">
    <aside class="info">
        <Chat
                on:chat="{handleCreateChatMessage}"
        ></Chat>
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
{#if $showSignIn}
<SignIn
        on:signIn="{signIn}"
        on:signUp="{signUp}"
></SignIn>
{/if}
