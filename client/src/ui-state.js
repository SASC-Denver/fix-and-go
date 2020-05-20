import {
	writable
} from 'svelte/store'

export let lastMessage = writable(null)
