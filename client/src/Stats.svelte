<script>
    export let attributes

    $: health = attributes ? attributes.health : 0
    $: maxHealth = attributes ? attributes.maxHealth : 1

    $: energy = attributes ? attributes.energy : 0
    $: maxEnergy = attributes ? attributes.maxEnergy : 1

    $: healthBar = getBar(health, maxHealth)
    $: energyBar = getBar(energy, maxEnergy)

    function getBar(
            value,
            maxValue
    ) {
        const numChars = Math.abs(value / maxValue * 50)
        let bar = '';
        for (let i = 0; i < numChars; i++) {
            bar += '-';
        }

        return bar;
    }
</script>
<style>
    table {
        white-space: nowrap;
    }

    td {
        height: 20px;
    }

    .stats-bar {
        width: 270px;
    }

    .stats-label {
        width: 52px;
    }
</style>
<table>
    <tr>
        <td
                class="stats-label"
        >Health: {health}/{maxHealth}
        </td>
        <td
                class="stats-bar"
        >
                {healthBar}
                    <!--
            --------------------------------------------------
            -->
        </td>
    </tr>
    <tr>
        <td
                class="stats-label"
        >Energy: {energy}/{maxEnergy}
        </td>
        <td
                class="stats-bar"
        >
                {energyBar}
                    <!--
            -------------------
            -->
        </td>
    </tr>
</table>
