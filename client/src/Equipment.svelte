<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {equipment, stats} from './ui-state'

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

        if (!equipmentAtSlot) {
            return equipmentSlot.substr(0, 1).toUpperCase() + equipmentSlot.substr(1)
        }

        return equipmentAtSlot.name
    }

    function getAttack() {
        if(!$stats) {
            return 'N/A'
        }

        return $stats.attack.numberOfDice + 'd' + $stats.attack.diceSides
                + '+' + $stats.attackBonus
    }

    function getArmor() {
        if(!$stats) {
            return 'N/A'
        }

        return $stats.armorClass
    }
</script>
<style>
    table {
        border: 1px solid black;
    }

    td div.equipment-slot {
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
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'head')}"
                    on:click="{_ => select('head')}"
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
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'wield')}"
                    on:click="{_ => select('wield')}"
            >
                {render($equipment, 'wield')}
            </div>
        </td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'arm')}"
                    on:click="{_ => select('arm')}"
            >
                {render($equipment, 'arm')}
            </div>
        </td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'body')}"
                    on:click="{_ => select('body')}"
            >
                {render($equipment, 'body')}
            </div>
        </td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'light')}"
                    on:click="{_ => select('light')}"
            >
                {render($equipment, 'light')}
            </div>
        </td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'hold')}"
                    on:click="{_ => select('hold')}"
            >
                {render($equipment, 'hold')}
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div>
                Attack
                <br>
                {getAttack($stats)}
            </div>
        </td>
        <td></td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'legs')}"
                    on:click="{_ => select('legs')}"
            >
                {render($equipment, 'legs')}
            </div>
        </td>
        <td></td>
        <td>
            <div>
                Armor
                <br>
                {getArmor($stats)}
            </div>
        </td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td>
            <div
                    class="equipment-slot"
                    class:hasItem="{hasItem($equipment, 'feet')}"
                    on:click="{_ => select('feet')}"
            >
                {render($equipment, 'feet')}
            </div>
        </td>
        <td></td>
        <td></td>
    </tr>
</table>
