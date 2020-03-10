<script>

	import {
		createEventDispatcher,
		onMount
	}           from 'svelte'
	import MenuItem         from './MenuItem.svelte'

	import {
		stateOfUser,
		stateOfShowMainMenu
	} from '@fix-and-go/logic'

	export let active

	let container
	const dispatch = createEventDispatcher()

	let menuItems = [{
		key: 'about',
		name: 'About Us'
	}, {
		key: 'release-plan',
		name: 'Release Plan'
	}, {
		key: 'feedback',
		name: 'Feedback'
	}]

	onMount(async (
		comp
	) => {
	})

	function selectMenu(menuItem) {
		dispatch('selected', menuItem)
	}

	function signIn() {
		// TODO: implement sign in
		stateOfShowMainMenu.toggle()
	}

	function signOut() {
		(async () => {
			// TODO: implement sign out
			stateOfShowMainMenu.toggle()
		})().then()
	}
</script>

<style>
	section {
		margin-top: 44px;
	}
</style>

<nav
		class:active="{active}"
		id="menu"
>
	<section
			class="pure-menu"
	>
		<ul class="pure-menu-list">
			{#each menuItems as menuItem}
			<MenuItem
					menuItem="{menuItem}"
					on:select="{() => selectMenu(menuItem)}"
			></MenuItem>
			{/each}

			{#if $stateOfUser}
			<li
					class="pure-menu-item"
					on:click="{signOut}"
			>
				<div
						class="pure-menu-link"
				>
					Sign Out
				</div>
			</li>
			{:else}
			<li
					class="pure-menu-item"
					on:click="{signIn}"
			>
				<div
						class="pure-menu-link"
				>
					Sign In
				</div>
			</li>
			{/if}
		</ul>
	</section>
	<div
			id="sizer"
	></div>

</nav>
