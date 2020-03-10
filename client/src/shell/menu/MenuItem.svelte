<script>
	import {createEventDispatcher} from 'svelte'
	import {
		stateOfUser,
		stateOfCurrentScreen
	}         from '@fix-and-go/logic'

	export let menuItem

	let theCurrentScreen = stateOfCurrentScreen

	const dispatch = createEventDispatcher()

	$: selectedClass = $theCurrentScreen && menuItem.key === $theCurrentScreen.key ? 'pure-menu-selected' : ''

	function click() {
		dispatch('select', menuItem)
	}

	function getLink(menuItem) {
		return menuItem.path ? menuItem.path : menuItem.key
	}

</script>

{#if !menuItem.auth || $stateOfUser}
<li
		class="pure-menu-item {selectedClass}"
		on:click="{click}"
>
	<a
			href="{getLink(menuItem)}"
			class="pure-menu-link"
	>
		{menuItem.name}
	</a>
</li>
{/if}
