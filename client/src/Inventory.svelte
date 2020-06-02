<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "./utils/items";
    import {inventory} from "./ui-state";

    export let filter;

    const dispatch = createEventDispatcher();

    let inventoryItems = [];

    $: itemRows = getItemRows(inventoryItems, 5, 4);

    $: inventoryItems = computeInventoryItems($inventory, filter)

    onMount(async () => {
    })

    onDestroy(() => {
    })

    let render = renderItem;

    function computeInventoryItems(
        items,
        filter
    ) {
        if (filter) {
            return items.filter(filter);
        }

        return items;
    }

    function selectInventoryItem(
        item
    ) {
        if (!item) {
            return;
        }

        dispatch('selectInventoryItem', {
            id: item.id,
            type: item.type
        });
    }

</script>
<style>
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
</style>
<table>
    {#each itemRows as itemRow}
    <tr>
        {#each itemRow as item}
        <td on:click|stopPropagation="{event => selectInventoryItem(item)}">
            <div>
                {render(item)}
            </div>
        </td>
        {/each}
    </tr>
    {/each}
</table>
