import {writable} from 'svelte/store'

export let lastMessage = writable(null)
export let lastChatBatch = writable([])
export let showSignIn = writable(true)
export let signInError = writable(null)
export let stateOfPopup = writable(false)

export function setCredentials(
    credentials
) {
    localStorage.setItem("credentials", JSON.stringify(credentials));
}

export function getCredentials() {
    let credentials = localStorage.getItem("credentials")

    if(!credentials) {
        return null
    }

    return JSON.parse(credentials);
}
