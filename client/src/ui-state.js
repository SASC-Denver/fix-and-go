import {
	writable
} from 'svelte/store'

export let lastMessage = writable(null)
export let lastChatBatch = writable([])
