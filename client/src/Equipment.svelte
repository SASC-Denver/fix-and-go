<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {equipment} from './ui-state'

    const dispatch = createEventDispatcher();

    onMount(async () => {
    })

    onDestroy(() => {
    })

    function hasItem(equipment, equipmentSlot) {
        return !!equipment[equipmentSlot];
    }

    function select(equipmentSlot) {
        dispatch('select', equipmentSlot)
    }

    function render(_, equipmentSlot) {
        let equipmentAtSlot = $equipment[equipmentSlot]

        if(!equipmentAtSlot) {
            return equipmentSlot.substr(0, 1).toUpperCase() + equipmentSlot.substr(1)
        }

        return equipmentAtSlot.name
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
<table
        class="equipment"
>
    <tr>
        <td></td>
        <td></td>
        <td>
            <div
                    on:click="{_ => select('head')}"
                    class:hasItem="{hasItem($equipment, 'head')}"
            >
                {render($equipment, 'head')}
            </div>
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>
            <div
                    on:click="{_ => select('wield')}"
                    class:hasItem="{hasItem($equipment, 'wield')}"
            >
                {render($equipment, 'wield')}
            </div>
        </td>
        <td>
            <div
                    on:click="{_ => select('arm')}"
                    class:hasItem="{hasItem($equipment, 'arm')}"
            >
                {render($equipment, 'arm')}
            </div>
        </td>
        <td>
            <div
                    on:click="{_ => select('body')}"
                    class:hasItem="{hasItem($equipment, 'body')}"
            >
                {render($equipment, 'body')}
            </div>
        </td>
        <td>
            <div
                    on:click="{_ => select('light')}"
                    class:hasItem="{hasItem($equipment, 'light')}"
            >
                {render($equipment, 'light')}
            </div>
        </td>
        <td>
            <div
                    on:click="{_ => select('hold')}"
                    class:hasItem="{hasItem($equipment, 'hold')}"
            >
                {render($equipment, 'hold')}
            </div>
        </td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>
            <div
                    on:click="{_ => select('legs')}"
                    class:hasItem="{hasItem($equipment, 'legs')}"
            >
                {render($equipment, 'legs')}
            </div>
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>
            <div
                    on:click="{_ => select('feet')}"
                    class:hasItem="{hasItem($equipment, 'feet')}"
            >
                {render($equipment, 'feet')}
            </div>
        </td>
        <td></td>
        <td></td>
    </tr>
</table>
