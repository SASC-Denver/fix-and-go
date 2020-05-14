import {
	derived,
	writable
} from 'svelte/store'

export let stateOfAuthChecked    = writable(false)
export let stateOfCurrentScreen  = writable(null)
export let stateOfMode           = writable(null)
export let stateOfPopup          = writable(false)
export let stateOfShowConfirm    = writable(false)
export let stateOfShowSignIn     = writable(false)
export let stateOfText           = writable({})
export let stateOfUser           = writable(null)

let lastSignedInState = {
	authChecked: false,
	showSignIn: false,
	user: null
}

export let stateOfSignedIn = derived([
	stateOfAuthChecked,
	stateOfShowSignIn,
	stateOfUser
], ([
	    $authChecked,
	    $showSignIn,
	    $user
    ]) => {
	const changed = {
		authChecked: $authChecked !== lastSignedInState.authChecked,
		showSignIn: $showSignIn !== lastSignedInState.showSignIn,
		user: $user !== lastSignedInState.user
	}

	lastSignedInState = {
		authChecked: $authChecked,
		showSignIn: $showSignIn,
		user: $user
	}

	return {
		changed,
		current: lastSignedInState
	}
})
