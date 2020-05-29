<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "../utils/items";
    import Inventory from '../Inventory.svelte'
    import {showZoneItems, zoneItemsError} from '../ui-state';
    import ActionPopover from './ActionPopover.svelte'

    export let zoneItems = []

    const dispatch = createEventDispatcher();

    const showItemsUnsubscribe = showZoneItems.subscribe(doShowItems => {
        zoneItemsError.set(null)
    });

    $: itemRows = getItemRows(zoneItems, 3, 4)

    onMount(async () => {
    })

    onDestroy(() => {
        showItemsUnsubscribe();
    })

    let render = renderItem

    function pickUpZoneItem(
        item
    ) {
        if (!item) {
            return
        }

        dispatch('pickUpZoneItem', {
            id: item.id,
            type: item.type
        });
    }

    function dropItemToZone(
        event
    ) {
        dispatch('dropItemToZone', event.detail);
    }

    function close() {
        showZoneItems.set(false)
    }

</script>

<style>
    aside {
        display: inline-block;
        height: 226px;
        overflow-y: scroll;
    }

    section {
        width: 100%;
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
        maxWidth="600px"
        on:cancel={close}
>
    <div slot="header">
        Pick Up/Drop item(s)
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
        <section>
            <aside>
                <table>
                    {#each itemRows as itemRow}
                    <tr>
                        {#each itemRow as item}
                        <td on:click|stopPropagation="{event => pickUpZoneItem(item)}">
                            <div>
                                {render(item)}
                            </div>
                        </td>
                        {/each}
                    </tr>
                    {/each}
                </table>
            </aside>
            <aside>
                <Inventory
                        on:selectInventoryItem={dropItemToZone}
                ></Inventory>
            </aside>
        </section>
        <br>
    </div>
    <!--
    <div slot="actions">
    </div>
    -->
</ActionPopover>
