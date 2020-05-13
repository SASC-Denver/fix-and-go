<script>
	import {
		onDestroy,
		onMount
	}
	from 'svelte'
	import { get } from 'svelte/store'
	import Menu from './shell/menu/Menu.svelte'
	import TopBar from './shell/top/TopBar.svelte'
	import TextToast from './shell/TextToast.svelte'
	import {
		stateOfShowMainMenu,
		stateOfTextToast
	}
	from '@fix-and-go/logic'

	// let topMenuMap
	let appShowMainMenu = stateOfShowMainMenu
	let lastTextToast = {}
	let showTextToast = false
	let textToastUnsubscribe

	$: activeClass = $appShowMainMenu ? 'active' : ''

	$: showLogo = $appShowMainMenu

	function clickMain() {
		// if (DOM_API.e(menuElementIdSelector)
		//   .className
		//   .indexOf('active') !== -1) {
		if (get(state.showMainMenu)) {
			toggleMenu()
		}
	}

	function handleResize(
		event
	) {
		// TODO: implement screen resize
	}

	function selectMenu(
		menuItem
	) {
		// navigateToPage(menuItem.id, menuItem.params)
		stateOfShowMainMenu.toggle()
	}

	function toggleMenu() {
		// if (get(showConfirm)) {
		// 	return
		// }
		stateOfShowMainMenu.toggle()
	}

	onMount(async() => {
		textToastUnsubscribe = stateOfTextToast.subscribe(
			value => {
				lastTextToast = value
				showTextToast = true
				setTimeout(() => {
					showTextToast = false
				}, value.seconds * 1000)
			})
	})

	onDestroy(() => {
		textToastUnsubscribe()
	})
</script>

<style>1026
</style>

<svelte:window on:resize="{handleResize}" />
<header>
	<div class="stats">
		<table>
			<tr>
				<td>
					<div class="stats-label">
						<div>H:</div>
						<div>M:</div>
					</div>
					<div class="stats-bar">
						<div>-------------------------------</div>
						<div>-------------------</div>
					</div>
				</td>
				<td></td>
			</tr>
		</table>
	</div>
	<div class="actions">
		<table>
			<tr>
				<td>Attack</td>
				<td>PickUp</td>
				<td> ...</td>
				<td> ...</td>
				<td> ...</td>
			</tr>
		</table>
	</div>
</header>
<section class="middle">
	<aside class="info">
		<section class="messages">
			Player1: Hello Player1.
			<br> Player2: Hi Player2.
		</section>
		<input class="message-input" type="text">
		<br>
		<br>
		<section class="events">
			You entered Zone 1.
			<br> A monster attacked you!
			<br> Monster hit you for 10 points.
			<br> You hit the monster for 12 points.
			<br> Monster hit you for 9 points.
			<br> You hit the monster for 10 points.
			<br> Monster hit you for 7 points.
			<br> You hit the monster for 11 points.
			<br> You won!
		</section>
	</aside>
	<main>
		<section class="middle-left">
			<table class="map">
				<tr>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
					<td>---------</td>
				</tr>
				<tr>
					<td>---------</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td>
						Zone
						<br> Gate
					</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td>---------</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>Store</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td>Player</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td>---------</td>
					<td>---------</td>
					<td></td>
					<td></td>
					<td>Monstr</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td>---------</td>
					<td>---------</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td>Item</td>
					<td></td>
					<td>---------</td>
					<td>---------</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td>---------</td>
					<td>---------</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</table>
		</section>
		<aside class="middle-right">
			<br>
			<table>
				<tr>
					<td></td>
					<td></td>
					<td>H</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>W</td>
					<td>A</td>
					<td>B</td>
					<td>T</td>
					<td>H</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>L</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>F</td>
					<td></td>
					<td></td>
				</tr>
			</table>
			<br>
			<table>
				<tr>
					<td>Item 1</td>
					<td>Item 2</td>
					<td>Item 3</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</table>
		</aside>
	</main>
</section>
