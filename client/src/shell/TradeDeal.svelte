<script>
    import {TradeDealChangeType} from "@fix-and-go/logic";
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "../utils/items";
    import {showZoneItems, zoneItemsError} from '../ui-state';
    import Inventory from '../Inventory.svelte'
    import ActionPopover from './ActionPopover.svelte'
    import StoreInventory from './StoreInventory.svelte'

    export let yourOfferedItems = []
    export let theirOfferedItems = []

    const dispatch = createEventDispatcher();

    const showItemsUnsubscribe = showZoneItems.subscribe(doShowItems => {
        zoneItemsError.set(null)
    });

    $: theirOfferedItemRows = getItemRows(theirOfferedItems, 3, 4)
    $: yourOfferedItemRows = getItemRows(yourOfferedItems, 3, 4)

    onMount(async () => {
    })

    onDestroy(() => {
        showItemsUnsubscribe();
    })

    let render = renderItem

    function removeYourOfferedItem(
        item
    ) {
        if (!item) {
            return
        }

        dispatch('tradeDealChange', {
            id: item.id,
            type: item.type,
            change: TradeDealChangeType.REMOVE_YOUR_ITEM
        });
    }

    function removeTheirOfferedItem(
        item
    ) {
        if (!item) {
            return
        }

        dispatch('removeTheirOfferedItem', {
            id: item.id,
            type: item.type,
            change: TradeDealChangeType.REMOVE_THEIR_ITEM
        });
    }

    function addYourOfferedItem(
        item
    ) {
        if (!item) {
            return
        }

        dispatch('addYourOfferedItem', {
            id: item.id,
            type: item.type,
            change: TradeDealChangeType.ADD_YOUR_ITEM
        });
    }

    function addTheirOfferedItem(
        item
    ) {
        if (!item) {
            return
        }

        dispatch('addTheirOfferedItem', {
            id: item.id,
            type: item.type,
            change: TradeDealChangeType.ADD_THEIR_ITEM
        });
    }

    function changeNumberOfYourOfferedCoins(
        numberOfCoinsString
    ) {
        const numberOfCoins = parseInt(numberOfCoinsString, 10)
        if (typeof numberOfCoins !== 'number') {
            return
        }

        dispatch('tradeDealChange', {
            numberOfCoins,
            change: TradeDealChangeType.CHANGE_YOUR_COINS
        });
    }

    function cancel() {
        dispatch('tradeDealCancel');
    }

    function commit() {
        dispatch('tradeDealCommit');
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

<ActionPopover
        maxWidth="900px"
>
    <div slot="header">
        Trade with Tester
    </div>
    <div slot="content">
        {#if $zoneItemsError}
        <div
                class="error"
        >
            {$zoneItemsError.value}
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
                                <td on:click|stopPropagation="{event => removeYourOfferedItem(yourOfferedItem)}">
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
                                <td on:click|stopPropagation="{event => removeTheirOfferedItem(theirOfferedItem)}">
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
                            on:selectInventoryItem={addYourOfferedItem}
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
                            on:selectInventoryItem={addTheirOfferedItem}
                    ></StoreInventory>
                </td>
            </tr>
        </table>
    </div>
    <div slot="actions">
        <button
                on:click={commit}
        >Commit
        </button>
        <button
                on:click={cancel}
        >Cancel
        </button>
    </div>
</ActionPopover>
