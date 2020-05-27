<script>
	import {
		onDestroy,
		onMount
	} from 'svelte'
	import {
		stateOfPopup
	} from '../ui-state'

	export let height = 'initial'
	export let maxWidth
	export let width

	$: theWidth = f(() => width ? width : '90%')

	onMount(() => stateOfPopup.set(true))
	onDestroy(() => stateOfPopup.set(false))

	function f(func) {
		return func()
	}

</script>

<style>
    aside {
        background-color: rgba(32, 32, 32, 0.7);
        height: 100%;
        left: 0px;
        position: fixed;
        top: 0px;
        width: 100%;
        z-index: 1200;
    }

    div {
        /*position: relative;*/
        width: 100%;
        height: 100%;
    }

    section {
        background-color: #fff;
        border: 1px solid black;
        border-radius: 5px;
        left: 50%;
        margin: 0;
        max-width: 400px;
        padding: 10px;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<aside>
    <div>
        <section
                style="
                height: {height};
                max-width: {maxWidth};
                width: {theWidth};
            "
        >
            <slot name="content">
            </slot>
        </section>
    </div>
</aside>
