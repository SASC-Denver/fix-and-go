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
    import {tradeDeal, tradeDealError} from '../ui-state';

    export let player;

    const dispatch = createEventDispatcher();

    $: yourOfferedItems = getExchangeItems($tradeDeal, true, $tradeDeal.version);

    $: inventoryFilter = getInventoryFilter(yourOfferedItems)

    $: theirOfferedItemRows = getItemRows(getExchangeItems($tradeDeal, false, $tradeDeal.version), 3, 4);
    $: yourOfferedItemRows = getItemRows(yourOfferedItems, 3, 4);

    $: initiatedTradeWaitingForReply = $tradeDeal.state === TradeDealState.STARTED
        && isPlayerTheInitiator($tradeDeal, player);
    $: needToReplyTradeInvite = $tradeDeal.state === TradeDealState.STARTED
        && !isPlayerTheInitiator($tradeDeal, player);

    $: otherUsername = getTradeSide($tradeDeal, false, player).username;

    $: yourSideCommitted = getTradeSide($tradeDeal, true, player).offer.committed;


    onMount(async () => {
        tradeDealError.set(null);
    })

    onDestroy(() => {
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
        numberOfCoinsString,
        tradeDeal,
    ) {
        const coins = parseInt(numberOfCoinsString, 10);
        if (typeof coins !== 'number') {
            return;
        }

        dispatch('tradeDealChange', {
            coins,
            type: TradeDealChangeType.CHANGE_YOUR_COINS,
            tradeDealId: tradeDeal.id
        });
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
                    Your:
                    <br>
                    Coins: 12
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
                    Their (Name):
                    <br>
                    Coins: 0
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
                    Your Purse: 123 coins
                    <br>
                    Transfer:
                    <input
                            type="text"
                    >
                </td>
                <td>
                    <StoreInventory
                            on:selectInventoryItem="{event => addTheirOfferedItem(event.detail, $tradeDeal)}"
                    ></StoreInventory>
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
