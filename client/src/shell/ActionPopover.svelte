<script>
	import {createEventDispatcher} from 'svelte'
	import Popover from './Popover.svelte'

	export let contentClass = ''
	export let contentStyles = ''
	export let customCancel = false
	export let infoOnly = false
	export let maxWidth
	export let viewOnly = false
	export let width

	const dispatch = createEventDispatcher()

	function cancel() {
		dispatch('cancel')
	}

</script>

<style>
	div[slot="content"] {
		color: #222;
	}

	footer {
		text-align: center;
		width: 100%;
	}

	footer div {
		text-align: center;
	}

	header {
		font-size: 1.3em;
		font-weight: bold;
		text-align: center;
		margin: 3px 0 15px 0;
		width: 100%;

	}

	nav {
		color: black;
		font-size: 0.7em;
		height: 50px;
		line-height: 50px;
		position: absolute;
		text-align: center;
		top: 0px;
		vertical-align: middle;
		width: 50px;
	}

	nav.left {
		left: 0px;
	}

	nav.right {
		right: 0px;
	}

	p {
		text-align: center;
	}

	.infoOnly {
		text-align: center;
		text-align: center;
	}
</style>

<Popover
		maxWidth="{maxWidth}"
		width="{width}"
>
	<div slot="content">
		<header>
			{#if !customCancel}
			<nav
					class="left"
					on:click="{cancel}"
			>
				╳
			</nav>
			<nav
					class="right"
					on:click="{cancel}"
			>
				╳
			</nav>
			{/if}
			<slot name="header"></slot>
		</header>
		<p
				class="{contentClass}"
				style="{contentStyles}"
		>
			<slot name="content"></slot>
		</p>
		{#if !viewOnly}
		<footer
				class:infoOnly="{infoOnly}"
		>
			{#if customCancel}
			<slot name="cancel"></slot>
			{/if}
			<div>
				<slot name="actions"></slot>
			</div>
		</footer>
		{/if}
	</div>
</Popover>
