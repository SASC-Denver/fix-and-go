<script>
    import {
        ErrorCode,
        GameObjectType,
        GamePlayer,
        isPlayerTheInitiator,
        TradeDealState,
        Zone
    } from '@fix-and-go/logic'
    import {onDestroy, onMount} from 'svelte'
    import SignIn from './shell/SignIn.svelte'
    import Chat from './Chat.svelte'
    import Equipment from './Equipment.svelte'
    import Events from './Events.svelte'
    import Inventory from './Inventory.svelte'
    import TradeDeal from './shell/TradeDeal.svelte'
    import ZoneItems from './shell/ZoneItems.svelte'
    import Map from './Map.svelte'
    import Stats from './Stats.svelte'
    import {
        getCredentials,
        inventory,
        lastChatBatch,
        lastMessage,
        mapSelection, purse,
        setCredentials,
        showSignIn,
        showZoneItems,
        signInError,
        tradeDeal,
        tradeDealError,
        zoneItemsError
    } from "./ui-state";
    // import TextToast from './shell/TextToast.svelte'

    let changeCount = 0
    let currentCellItems = []
    let eventCount = 0
    let lastUpdateSecond = 0
    let mapSelectionUnsubscribe
    let objectAtSelection
    let player
    let testZone

    $: showTradeDeal = !!$tradeDeal

    onMount(async () => {
        testZone = new Zone();

        const credentials = getCredentials();

        if (credentials) {
            showSignIn.set(false);
            if (!await doSignIn(credentials)) {
                showSignIn.set(true);
            }
        }

        mapSelectionUnsubscribe = mapSelection.subscribe(object =>
            objectAtSelection = object)

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
        getInventory().then()
    }

    onDestroy(() => {
        mapSelectionUnsubscribe()
        // textToastUnsubscribe()
    })

    function handleMove(moveEvent) {
        putData('api/move', {
            playerId: player.attributes.id,
            positionChange: moveEvent.detail.positionChange
        }).then()
    }

    function handleCreateChatMessage(chatEvent) {
        putData('api/chat', {
            playerId: player.attributes.id,
            text: chatEvent.detail.text
        }).then()
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
        const data = await getData('api/updates?playerId=' + player.attributes.id
            + '&lastUpdateSecond=' + lastUpdateSecond);
        testZone.updateObjects(data.zone.dimensions,
            data.zone.updates,
            player)
        if (data.chat.length) {
            lastChatBatch.set(data.chat);
        }
        if (data.tradeDeal) {
            if (data.tradeDeal.state === TradeDealState.COMPLETED
                || data.tradeDeal.state === TradeDealState.CANCELLED) {
                closeTradeDeal(data)
            } else {
                tradeDeal.subscribe(lastTradeDeal => {
                    if (!lastTradeDeal) {
                        getInventory().then()
                    }
                })()
                tradeDeal.set(data.tradeDeal)
            }
        } else {
            closeTradeDeal(data)
        }
        lastUpdateSecond = data.currentSecond
        changeCount++
    }

    function closeTradeDeal(
        data
    ) {
        tradeDeal.subscribe(lastTradeDeal => {
            if (lastTradeDeal) {
                let otherPlayerUsername = lastTradeDeal.parties.initiator.username;
                if (isPlayerTheInitiator(lastTradeDeal, player)) {
                    otherPlayerUsername = lastTradeDeal.parties.receiver.username;
                }
                let tradeDealStatus = 'Canceled'
                if (data.tradeDeal
                    && data.tradeDeal.state === TradeDealState.COMPLETED) {
                    tradeDealStatus = 'Completed'

                }

                lastMessage.set({
                    eventId: ++eventCount,
                    value: `Trade with "${otherPlayerUsername}" ${tradeDealStatus}`
                });
                tradeDeal.set(null)
                getInventory().then()
            }
        })()
    }

    function signIn(event) {
        doSignIn(event.detail).then()
    }

    async function doSignIn(
        inputData
    ) {
        const data = await putData('api/signIn', inputData, signInError);

        if (!data) {
            return false;
        }

        setCredentials(inputData);
        onSignIn(data.attributes);
        showSignIn.set(false);

        return true;
    }

    function signUp(event) {
        doSignUp(event.detail).then()
    }

    async function doSignUp(
        inputData
    ) {
        const data = await putData('api/signUp', inputData, signInError);
        if (!data) {
            return false;
        }
        setCredentials(inputData);
        onSignIn(data.attributes);
        showSignIn.set(false);

        return true;
    }

    async function getInventory() {
        doGetInventory().then()
    }

    async function doGetInventory() {
        const data = await getData('api/getInventory?playerId=' + player.attributes.id);
        if (!data) {
            return;
        }
        inventory.set(data.inventory);
        purse.set(data.purse);
    }

    async function inspectZoneItems() {
        doInspectZoneItems().then()
    }

    async function doInspectZoneItems() {
        const data = await getData('api/inspectZoneItems?playerId=' + player.attributes.id);
        if (!data) {
            return;
        }
        currentCellItems = data.zoneItems
        inventory.set(data.inventory)
        showZoneItems.set(true)
    }

    function pickUpZoneItem(
        event
    ) {
        doPickUpZoneItem(event.detail).then()
    }

    async function doPickUpZoneItem(
        inputData
    ) {
        const data = await putData('api/pickUpZoneItem', {
            playerId: player.attributes.id,
            ...inputData
        }, zoneItemsError);
        if (!data) {
            return;
        }

        currentCellItems = data.zoneItems
        inventory.set(data.inventory)
    }

    function dropItemToZone(
        event
    ) {
        doDropItemToZone(event.detail).then()
    }

    async function doDropItemToZone(
        inputData
    ) {
        const data = await putData('api/dropItemToZone', {
            playerId: player.attributes.id,
            ...inputData
        }, zoneItemsError);
        if (!data) {
            return;
        }

        currentCellItems = data.zoneItems
        inventory.set(data.inventory)
    }


    function tradeDealStart(
        event
    ) {
        if (!objectAtSelection
            || objectAtSelection.attributes.type !== GameObjectType.PLAYER) {
            return;
        }
        doTradeDealStart(objectAtSelection).then()
    }

    async function doTradeDealStart(
        toPlayer
    ) {
        await putData('api/tradeDealStart', {
            playerId: player.attributes.id,
            toPlayerId: toPlayer.attributes.id
        });
    }

    function tradeDealReply(
        event
    ) {
        doTradeDealReply(event.detail).then()
    }

    async function doTradeDealReply(
        inputData
    ) {
        const data = await putData('api/tradeDealReply', {
            playerId: player.attributes.id,
            ...inputData
        }, tradeDealError);
        if (!data) {
            return;
        }

        // TODO: implement
    }

    function tradeDealChange(
        event
    ) {
        tradeDealError.set(null);
        doTradeDealChange(event.detail).then();
    }

    async function doTradeDealChange(
        inputData
    ) {
        const data = await putData('api/tradeDealChange', {
            playerId: player.attributes.id,
            ...inputData
        }, tradeDealError);
        if (!data) {
            return;
        }

        // TODO: implement
    }

    function tradeDealCancel(
        event
    ) {
        doTradeDealCancel(event.detail).then()
    }

    async function doTradeDealCancel(
        inputData
    ) {
        const data = await putData('api/tradeDealCancel', {
            playerId: player.attributes.id,
            ...inputData
        }, tradeDealError);
        if (!data) {
            return;
        }

        // TODO: implement
    }

    function tradeDealCommit(
        event
    ) {
        doTradeDealCommit(event.detail).then()
    }

    async function doTradeDealCommit(
        inputData
    ) {
        const data = await putData('api/tradeDealCommit', {
            playerId: player.attributes.id,
            ...inputData
        }, tradeDealError);
        if (!data) {
            return;
        }

        // TODO: implement
    }

    async function getData(
        url,
        errorMessageStore = lastMessage
    ) {
        let data = null
        try {
            // console.log('GET: ' + url);
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
            });
            data = await response.json();
        } catch (e) {
            errorMessageStore.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
            return null;
        }
        if (hasRemoteError(data, errorMessageStore)) {
            return null;
        }

        return data;
    }

    async function putData(
        url,
        inputData,
        errorMessageStore = lastMessage
    ) {
        let data = null
        try {
            // console.log('PUT: ' + url);
            // console.log(JSON.stringify(data, null, 2));
            const response = await fetch(url, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputData)
            });
            data = await response.json();
        } catch (e) {
            errorMessageStore.set({
                eventId: ++eventCount,
                value: 'Connection lost'
            });
            return null;
        }
        if (hasRemoteError(data, errorMessageStore)) {
            return null;
        }

        return data;
    }

    function hasRemoteError(
        data,
        errorMessageStore
    ) {
        if (!data.error) {
            return false;
        }

        let value = data.message
        if (!value) {
            value = data.error.description
            switch (data.error.code) {
                case ErrorCode.REQUESTING_TOO_FREQUENTLY:
                    // No message needed?
                    return true;
            }
        }
        errorMessageStore.set({
            eventId: ++eventCount,
            value
        });

        return true;
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
                <td
                        on:click="{tradeDealStart}"
                >Trade
                </td>
                <td
                        on:click={inspectZoneItems}
                >PickUp /Drop
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
                    changeCount="{changeCount}"
                    on:move="{handleMove}"
                    player="{player}"
                    zone="{testZone}"
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
{#if $showZoneItems}
<ZoneItems
        on:pickUpZoneItem="{pickUpZoneItem}"
        on:dropItemToZone="{dropItemToZone}"
        zoneItems={currentCellItems}
></ZoneItems>
{/if}
{#if showTradeDeal}
<TradeDeal
        player="{player}"
        on:tradeDealCancel="{tradeDealCancel}"
        on:tradeDealChange="{tradeDealChange}"
        on:tradeDealCommit="{tradeDealCommit}"
        on:tradeDealReply="{tradeDealReply}"
></TradeDeal>
{/if}
