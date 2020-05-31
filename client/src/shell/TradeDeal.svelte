<script>
    import {TradeDealChangeType, TradeDealState} from "@fix-and-go/logic";
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "../utils/items";
    import ActionPopover from './ActionPopover.svelte'
    import Inventory from '../Inventory.svelte'
    import StoreInventory from './StoreInventory.svelte'
    import {showZoneItems, tradeDeal, tradeDealError} from '../ui-state';
    import {getTradeSide, isPlayerTheInitiator} from "../utils/tradeDeal";

    export let player

    const dispatch = createEventDispatcher();

    $: theirOfferedItemRows = getItemRows(getExchangeItems($tradeDeal, false), 3, 4)
    $: yourOfferedItemRows = getItemRows(getExchangeItems($tradeDeal, true), 3, 4)

    $: initiatedTradeWaitingForReply = $tradeDeal.state === TradeDealState.STARTED
        && isPlayerTheInitiator($tradeDeal, player)
    $: needToReplyTradeInvite = $tradeDeal.state === TradeDealState.STARTED
        && !isPlayerTheInitiator($tradeDeal, player)

    $: otherUsername = getTradeSide($tradeDeal, false, player).username

    onMount(async () => {
        tradeDealError.set(null)
    })

    onDestroy(() => {
    })

    function getExchangeItems(
        tradeDeal,
        yourSide
    ) {
        return getTradeSide(tradeDeal, yourSide, player)
    }

    function accept(
        tradeDeal
    ) {
        dispatch('tradeDealReply', {
            accept: true,
            tradeDealId: tradeDeal.id
        })
    }

    function deny(
        tradeDeal
    ) {
        dispatch('tradeDealReply', {
            accept: false,
            tradeDealId: tradeDeal.id
        })
    }

    let render = renderItem

    function removeYourOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return
        }

        dispatch('tradeDealChange', {
            change: TradeDealChangeType.REMOVE_YOUR_ITEM,
            id: item.id,
            tradeDealId: tradeDeal.id,
            type: item.type,
        });
    }

    function removeTheirOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return
        }

        dispatch('removeTheirOfferedItem', {
            change: TradeDealChangeType.REMOVE_THEIR_ITEM,
            id: item.id,
            tradeDealId: tradeDeal.id,
            type: item.type,
        });
    }

    function addYourOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return
        }

        dispatch('addYourOfferedItem', {
            change: TradeDealChangeType.ADD_YOUR_ITEM,
            id: item.id,
            tradeDealId: tradeDeal.id,
            type: item.type,
        });
    }

    function addTheirOfferedItem(
        item,
        tradeDeal
    ) {
        if (!item) {
            return
        }

        dispatch('addTheirOfferedItem', {
            change: TradeDealChangeType.ADD_THEIR_ITEM,
            id: item.id,
            tradeDealId: tradeDeal.id,
            type: item.type,
        });
    }

    function changeNumberOfYourOfferedCoins(
        numberOfCoinsString,
        tradeDeal,
    ) {
        const numberOfCoins = parseInt(numberOfCoinsString, 10)
        if (typeof numberOfCoins !== 'number') {
            return
        }

        dispatch('tradeDealChange', {
            change: TradeDealChangeType.CHANGE_YOUR_COINS,
            numberOfCoins,
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
                            on:selectInventoryItem="{event => addYourOfferedItem($tradeDeal)}"
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
                            on:selectInventoryItem="{event => addTheirOfferedItem($tradeDeal)}"
                    ></StoreInventory>
                </td>
            </tr>
        </table>
    </div>
    <div slot="actions">
        <button
                on:click="{event => commit($tradeDeal)}"
        >Commit
        </button>
        <button
                on:click="{event => cancel($tradeDeal)}"
        >Cancel
        </button>
    </div>
</ActionPopover>
{/if}
