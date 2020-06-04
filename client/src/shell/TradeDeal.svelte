<script>
    import {
        getTradeSide,
        isPlayerTheInitiator,
        TradeDealChangeType,
        TradeDealState
    } from "@fix-and-go/logic";
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "../utils/items";
    import ActionPopover from './ActionPopover.svelte'
    import Inventory from '../Inventory.svelte'
    import StoreInventory from './StoreInventory.svelte'
    import {purse, tradeDeal, tradeDealError} from '../ui-state';

    export let player;

    const dispatch = createEventDispatcher();
    let tradeDealUnsubscribe;
    let offeredCoins = {
        your: {
            value: getTradeSide($tradeDeal, true, player).offer.coins,
            changedLocally: false
        },
        their: {
            value: getTradeSide($tradeDeal, false, player).offer.coins,
            changedLocally: false
        }
    };

    $: yourPurseCoins = $purse - offeredCoins.your.value;

    $: yourOfferedItems = getExchangeItems($tradeDeal, true, $tradeDeal.version);
    $: inventoryFilter = getInventoryFilter(yourOfferedItems)

    $: theirOfferedItemRows = getItemRows(getExchangeItems($tradeDeal, false, $tradeDeal.version), 3, 4);
    $: yourOfferedItemRows = getItemRows(yourOfferedItems, 3, 4);

    $: initiatedTradeWaitingForReply = $tradeDeal.state === TradeDealState.REQUESTED
        && isPlayerTheInitiator($tradeDeal, player);
    $: needToReplyTradeInvite = $tradeDeal.state === TradeDealState.REQUESTED
        && !isPlayerTheInitiator($tradeDeal, player);

    $: otherUsername = getTradeSide($tradeDeal, false, player).username;

    $: yourSideCommitted = getTradeSide($tradeDeal, true, player).offer.committed;

    onMount(async () => {
        tradeDealUnsubscribe = tradeDeal.subscribe(currentTradeDeal => {
            if(!$tradeDeal) {
                return;
            }
            const yourTradeSide = getTradeSide($tradeDeal, true, player);
            const theirTradeSide = getTradeSide($tradeDeal, false, player);

            if (!offeredCoins.your.changedLocally
                && (yourTradeSide.offer.coins || offeredCoins.your.value)) {
                // console.log('yourTradeSide.offer.coins: ' + yourTradeSide.offer.coins)
                // console.log('offeredCoins.your.value:   ' + offeredCoins.your.value)
                offeredCoins.your.value = yourTradeSide.offer.coins;
            }
            offeredCoins.your.changedLocally = false;

            if (!offeredCoins.your.changedLocally
                && (theirTradeSide.offer.coins || offeredCoins.their.value)) {
                offeredCoins.their.value = theirTradeSide.offer.coins;
            }
            offeredCoins.their.changedLocally = false;
        })
        tradeDealError.set(null);
    })

    onDestroy(() => {
        tradeDealUnsubscribe()
    })

    function getExchangeItems(
        tradeDeal,
        yourSide
    ) {
        return getTradeSide(tradeDeal, yourSide, player).offer.items;
    }

    function accept(
        tradeDeal
    ) {
        dispatch('tradeDealReply', {
            accept: true,
            tradeDealId: tradeDeal.id
        });
    }

    function deny(
        tradeDeal
    ) {
        dispatch('tradeDealReply', {
            accept: false,
            tradeDealId: tradeDeal.id
        });
    }

    let render = renderItem;

    function getInventoryFilter(
        yourOfferedItems
    ) {
        const hasItemByTypeAndId = {}
        yourOfferedItems.forEach(item => {
            let hasItemOfType = hasItemByTypeAndId[item.type];
            if (!hasItemOfType) {
                hasItemOfType = {};
                hasItemByTypeAndId[item.type] = hasItemOfType;
            }
            hasItemOfType[item.id] = true
        })
        return (
            item
        ) => {
            const hasItemOfType = hasItemByTypeAndId[item.type]
            return !(hasItemOfType && hasItemOfType[item.id])
        }
    }

    function removeYourOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return;
        }

        dispatch('tradeDealChange', {
            item,
            tradeDealId: tradeDeal.id,
            type: TradeDealChangeType.REMOVE_YOUR_ITEM,
        });
    }

    function removeTheirOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return;
        }

        dispatch('tradeDealChange', {
            item,
            tradeDealId: tradeDeal.id,
            type: TradeDealChangeType.REMOVE_THEIR_ITEM,
        });
    }

    function addYourOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return;
        }

        dispatch('tradeDealChange', {
            item,
            tradeDealId: tradeDeal.id,
            type: TradeDealChangeType.ADD_YOUR_ITEM,
        });
    }

    function addTheirOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return;
        }

        dispatch('tradeDealChange', {
            item,
            tradeDealId: tradeDeal.id,
            type: TradeDealChangeType.ADD_THEIR_ITEM,
        });
    }

    function changeNumberOfYourOfferedCoins(
        event,
        tradeDeal,
    ) {
        if (!isValidCoinsInputKey(event)) {
            return;
        }
        let yourOfferedCoinsPreviously = 0;
        if (offeredCoins.your.value) {
            yourOfferedCoinsPreviously = parseInt(offeredCoins.your.value, 10);
        }
        // console.log('yourOfferedCoins before: ' + yourOfferedCoins);
        setTimeout(() => {
            let coins = 0;
            if (offeredCoins.your.value) {
                coins = parseInt(offeredCoins.your.value, 10);

            }
            // console.log('yourOfferedCoins after: ' + yourOfferedCoins);
            if (yourOfferedCoinsPreviously === coins) {
                // console.log('same your offered coins: ' + coins);
                return;
            }
            offeredCoins.your.changedLocally = true;

            dispatch('tradeDealChange', {
                coins,
                type: TradeDealChangeType.CHANGE_YOUR_COINS,
                tradeDealId: tradeDeal.id
            });
        }, 1)
    }

    function changeNumberOfTheirOfferedCoins(
        event,
        tradeDeal,
    ) {
        if (!isValidCoinsInputKey(event)) {
            return
        }
        let theirOfferedCoinsPreviously = 0
        if (offeredCoins.their.value) {
            theirOfferedCoinsPreviously = parseInt(offeredCoins.their.value, 10);
        }
        setTimeout(() => {
            let coins = 0
            if (offeredCoins.their.value) {
                coins = parseInt(offeredCoins.their.value, 10);
            }
            if (theirOfferedCoinsPreviously === coins) {
                // console.log('same their offered coins: ' + coins)
                return
            }
            offeredCoins.their.changedLocally = true;

            dispatch('tradeDealChange', {
                coins,
                type: TradeDealChangeType.CHANGE_THEIR_COINS,
                tradeDealId: tradeDeal.id
            });
        }, 1)
    }

    function cancel(
        tradeDeal
    ) {
        dispatch('tradeDealCancel', {
            tradeDealId: tradeDeal.id
        });
    }

    function commit(
        tradeDeal
    ) {
        dispatch('tradeDealCommit', {
            tradeDealId: tradeDeal.id
        });
    }

    function isValidCoinsInputKey(event) {
        switch (event.key) {
            case 'Shift':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'Backspace':
            case 'Delete':
                return true;
        }

        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
            return false;
        }

        return true;
    }

</script>

<style>
    aside {
        height: 226px;
        overflow-y: scroll;
    }

    table.layout {
        width: 100%;
    }

    table.layout > tr > td {
        border: 0px;
        height: initial;
        width: initial;
    }

    td div {
        align-content: center;
        display: flex;
        flex-direction: column;
        height: 50px;
        justify-content: center;
        overflow: hidden;
        text-align: center;
        word-break: break-all;
    }

    .error {
        padding: 5px;
        text-align: center;
    }

</style>

{#if initiatedTradeWaitingForReply}
<ActionPopover
        maxWidth="400px"
>
    <div slot="header">
        Trade request with "{otherUsername}"
    </div>
    <div slot="content">
        Wating for "{otherUsername}" to accept your trade invitation.
        {#if $tradeDealError}
        <div
                class="error"
        >
            {$tradeDealError.value}
        </div>
        {/if}
    </div>
    <div slot="actions">
        <button
                on:click="{event => cancel($tradeDeal)}"
        >Cancel
        </button>
    </div>
</ActionPopover>
{:else if needToReplyTradeInvite}
<ActionPopover
        maxWidth="400px"
>
    <div slot="header">
        Invitation to trade with "{otherUsername}"
    </div>
    <div slot="content">
        "{otherUsername}" wants to trade with you.
        {#if $tradeDealError}
        <div
                class="error"
        >
            {$tradeDealError.value}
        </div>
        {/if}
    </div>
    <div slot="actions">
        <button
                on:click="{event => accept($tradeDeal)}"
        >Accept
        </button>
        <button
                on:click="{event => deny($tradeDeal)}"
        >Deny
        </button>
    </div>
</ActionPopover>
{:else}
<ActionPopover
        maxWidth="900px"
>
    <div slot="header">
        Trade with "{otherUsername}"
    </div>
    <div slot="content">
        {#if $tradeDealError}
        <div
                class="error"
        >
            {$tradeDealError.value}
        </div>
        {/if}
        <br>
        <table class="layout">
            <tr>
                <td>
                    Your Offer:
                    <br>
                    Coins: <input
                        bind:value={offeredCoins.your.value}
                        maxlength="6"
                        on:keydown="{event => changeNumberOfYourOfferedCoins(event, $tradeDeal)}"
                        type="text"
                >
                    <br>
                    Items:
                    <br>
                    <aside>
                        <table>
                            {#each yourOfferedItemRows as yourOfferedItemRow}
                            <tr>
                                {#each yourOfferedItemRow as yourOfferedItem}
                                <td on:click|stopPropagation="{event => removeYourOfferedItem(yourOfferedItem, $tradeDeal)}">
                                    <div>
                                        {render(yourOfferedItem)}
                                    </div>
                                </td>
                                {/each}
                            </tr>
                            {/each}
                        </table>
                    </aside>
                </td>
                <td>
                    Their Offer:
                    <br>
                    Coins: <input
                        bind:value={offeredCoins.their.value}
                        maxlength="6"
                        on:keydown="{event => changeNumberOfTheirOfferedCoins(event, $tradeDeal)}"
                        type="text"
                >
                    <br>
                    Items:
                    <br>
                    <aside>
                        <table>
                            {#each theirOfferedItemRows as theirOfferedItemRow}
                            <tr>
                                {#each theirOfferedItemRow as theirOfferedItem}
                                <td on:click|stopPropagation="{event => removeTheirOfferedItem(theirOfferedItem, $tradeDeal)}">
                                    <div>
                                        {render(theirOfferedItem)}
                                    </div>
                                </td>
                                {/each}
                            </tr>
                            {/each}
                        </table>
                    </aside>
                </td>
            </tr>
            <tr>
                <td>
                    Your Inventory
                    <Inventory
                            filter="{inventoryFilter}"
                            on:selectInventoryItem="{event => addYourOfferedItem(event.detail, $tradeDeal)}"
                    ></Inventory>
                    Your Purse: {yourPurseCoins} coins
                    <br>
                </td>
                <td>
                    <!--
                    <StoreInventory
                            on:selectInventoryItem="{event => addTheirOfferedItem(event.detail, $tradeDeal)}"
                    ></StoreInventory>
                    -->
                </td>
            </tr>
        </table>
    </div>
    <div slot="actions">
        {#if yourSideCommitted}
        <button
                disabled
        >
            Awaiting Response ...
        </button>
        {:else}
        <button
                on:click="{event => commit($tradeDeal)}"
        >Commit
        </button>
        {/if}
        <button
                on:click="{event => cancel($tradeDeal)}"
        >Cancel
        </button>
    </div>
</ActionPopover>
{/if}
