<script>
	import {
		onDestroy,
		onMount
	}            from 'svelte'
	import {get} from 'svelte/store'
	import Menu          from './shell/menu/Menu.svelte'
	import TopBar        from './shell/top/TopBar.svelte'
	import TextToast        from './shell/TextToast.svelte'
	import {
		stateOfShowMainMenu,
		stateOfTextToast
	} from '@fix-and-go/logic'

	// let topMenuMap
	let appShowMainMenu = stateOfShowMainMenu
	let lastTextToast   = {}
	let showTextToast   = false
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

	onMount(async () => {
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

<style>
    @media (min-width: 62em) {
        #main {
            margin: 1em 23%;
            width: 54%;
        }
    }

    div {
        color: white;
        background: #191818;
        height: 44px;
        line-height: 44px;
        position: fixed;
        text-align: center;
        top: 0px;
        vertical-align: middle;
        width: 160px;
        z-index: 1200;
    }

    article {
        overflow-y: auto;
        overflow-x: hidden;
    }

    article.noOverflow {
        overflow: initial;
    }

    nav {
        z-index: 1100;
    }
</style>

<svelte:window on:resize={handleResize}/>
    <article
            class="{activeClass} wrapper"
            class:noOverflow="{true}"
            id="layout"
    >
        <!-- Menu toggle -->
        <TopBar></TopBar>
        {#if showLogo}
        <div>
            Fix-n-Go
        </div>
        {/if}

        <nav
                class="menu-link {activeClass}"
                id="menuLink"
                on:click="{toggleMenu}"
        >
            <!--Hamburger icon -->
            <span></span>
        </nav>
        <Menu
                active="{$stateOfShowMainMenu}"
                on:selected="{selectMenu}"
        ></Menu>
        <section
                id="main"
                on:click="{clickMain}"
        >
            <!--
            <svelte:component this="{PageComp}"/>
            -->
        </section>
    </article>
    {#if showTextToast}
    <TextToast
            text="{$stateOfTextToast.text}"
    ></TextToast>
    {/if}
