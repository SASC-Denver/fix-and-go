<script>
	import {
		onDestroy,
		onMount
	}
	from 'svelte'
	import { get } from 'svelte/store'
	import Chat from './Chat.svelte'
	import Equipment from './Equipment.svelte'
	import Events from './Events.svelte'
	import Inventory from './Inventory.svelte'
	import Map from './Map.svelte'
	import Stats from './Stats.svelte'
	// import TextToast from './shell/TextToast.svelte'

	onMount(async() => {
		// textToastUnsubscribe = stateOfTextToast.subscribe(
		// 	value => {
		// 		lastTextToast = value
		// 		showTextToast = true
		// 		setTimeout(() => {
		// 			showTextToast = false
		// 		}, value.seconds * 1000)
		// 	})
	})

	onDestroy(() => {
		// textToastUnsubscribe()
	})
</script>

<style>
	header {
		clear: both;
		margin: auto;
		width: 1150px;
	}

	main {
		float: right;
		width: calc(100% - 301px);
	}

	.actions {
		float: right;
	}

	.info {
		float: left;
		width: 300px;
	}

	.middle {
		clear: both;
		margin: auto;
		width: 1150px;
	}

	.middle-left {
		float: left;
		width: calc(100% - 283px);
	}

	.middle-right {
		float: right;
		width: 282px;
	}

	.stats {
		float: left;
	}

	.stats td {
		width: 325px;
	}
</style>

<header>
	<div class="stats">
		<table>
			<tr>
				<td>
					<Stats></Stats>
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
		<Chat></Chat>
		<br>
		<br>
		<Events></Events>
	</aside>
	<main>
		<section class="middle-left">
			<Map></Map>
		</section>
		<aside class="middle-right">
			<br>
			<Equipment></Equipment>
			<br>
			<Inventory></Inventory>
		</aside>
	</main>
</section>
