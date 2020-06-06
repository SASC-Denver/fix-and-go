<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {getItemRows, renderItem} from "./utils/items";
    import {inventory} from "./ui-state";

    export let filter;

    const dispatch = createEventDispatcher();

    let inventoryItems = [];

    $: inventoryItems = computeInventoryItems($inventory, filter)
    $: itemRows = getItemRows(inventoryItems, 5, 4);

    onMount(async () => {
    })

    onDestroy(() => {
    })

    function hasItem(item) {
        return !!item;
    }

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

        dispatch('select', item);
    }

</script>
<style>
    table {
        border: 1px solid black;
    }
    td div {
        border: 1px dotted black;
    }

    td div.hasItem {
        border: 1px solid black;
    }
</style>
<table>
    {#each itemRows as itemRow}
    <tr>
        {#each itemRow as item}
        <td on:click|stopPropagation="{event => selectInventoryItem(item)}">
            <div
                    class:hasItem="{hasItem(item)}"
            >
                {render(item)}
            </div>
        </td>
        {/each}
    </tr>
    {/each}
</table>
