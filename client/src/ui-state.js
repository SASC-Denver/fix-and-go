import {writable} from 'svelte/store'

export let inventory = writable([])
export let lastMessage = writable(null)
export let lastChatBatch = writable([])
export let mapSelection = writable(null)
export let showSignIn = writable(true)
export let showZoneItems = writable(false)
export let signInError = writable(null)
export let stateOfPopup = writable(false)
export let storeInventory = writable([])
export let tradeDeal = writable(null)
export let tradeDealError = writable(null)
export let zoneItemsError = writable(null)

export function setCredentials(
    credentials
) {
    localStorage.setItem("credentials", JSON.stringify(credentials));
}

export function getCredentials() {
    let credentials = localStorage.getItem("credentials")

    if (!credentials) {
        return null
    }

    return JSON.parse(credentials);
}
