import {writable} from 'svelte/store'

export let lastMessage = writable(null)
export let lastChatBatch = writable([])
export let showSignIn = writable(true)
export let signInError = writable(null)
export let stateOfPopup = writable(false)
