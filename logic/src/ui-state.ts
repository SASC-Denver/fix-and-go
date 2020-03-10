import {
	derived,
	get,
	Readable,
	writable
} from 'svelte/store'

export type Id = number
export type User_Id = Id
export type User_Name = string

export type Timestamp_Milliseconds = number
export type Timestamp_TimezoneOffset = number
export type Timestamp_Server = any
export type Timestamp_Timezone = string

export type Screen_Path = string

export type Screen_Authenticated = boolean
export type Screen_RightMenu = boolean

export type Route_ParamValue = string

export interface ITimestamp {

	m: Timestamp_Milliseconds // milliseconds
	o: Timestamp_TimezoneOffset // timezone offset
	s: Timestamp_Server // server timestamp
	z: Timestamp_Timezone // the timezone as extracted from JS Date.toString()

}

export interface IUser
	extends IIdentified<User_Id> {

	name: User_Name

}

export interface IUserCreated<K extends Id>
	extends IIdentified<K> {

	createdAt: ITimestamp
	userId: User_Id

}

export interface IIdentified<K extends Id> {

	id: K

}

export interface IScreenConfig {

	authenticated: Screen_Authenticated
	key: Screen_Path
	rightMenu: Screen_RightMenu

}

export interface ITextToast {

	seconds: number
	text: string
	time: number

}

export interface IToggleStore
	extends Readable<boolean> {

	toggle(): void

}

export interface ITextToastStore
	extends Readable<ITextToast> {

	toggle(
		newText: string,
		seconds?: number
	): void

}

export interface ISignedInStateChanged {

	authChecked: boolean
	showSignIn: boolean
	user: boolean

}

export interface ISignedInStateCurrent {

	authChecked: boolean
	showSignIn: boolean
	user: IUser

}

export interface ISignedInState {
	changed: ISignedInStateChanged
	current: ISignedInStateCurrent
}

function createShowMainMenu(): IToggleStore {
	const store = writable(false)

	return {
		subscribe: store.subscribe,
		toggle: () => store.set(!get(store))
	}
}

function createTopMenuShown(): IToggleStore {
	const store = writable(false)

	return {
		subscribe: store.subscribe,
		toggle: () => store.set(!get(store))
	}
}

function createTextToast(): ITextToastStore {
	const {set, subscribe} = writable({
		seconds: 0,
		text: '',
		time: null
	})

	return {
		subscribe,
		toggle: (
			newText,
			seconds = 3
		) => {
			set({
				seconds,
				text: newText,
				time: new Date().getTime()
			})
		}
	}
}

export let stateOfAuthChecked    = writable(false)
export let stateOfCurrentScreen  = writable<IScreenConfig>(null)
export let stateOfMode           = writable<string>(null)
export let stateOfPageTitle      = writable('Fix-n-go')
export let stateOfPopup          = writable<boolean>(false)
export let stateOfShowConfirm    = writable(false)
export let stateOfShowMainMenu   = createShowMainMenu()
export let stateOfShowSignIn     = writable(false)
export let stateOfText           = writable({})
export let stateOfTextToast      = createTextToast()
export const stateOfTopMenuShown = createTopMenuShown()
export let stateOfUser           = writable<IUser>(null)

export let stateOfShowTopMenu = derived<any, boolean>([
		stateOfShowMainMenu,
		stateOfTopMenuShown
	],
	([
		 $showMainMenu,
		 $topMenuShown
	 ]) => !$showMainMenu && $topMenuShown)

let lastSignedInState = {
	authChecked: false,
	showSignIn: false,
	user: null
}

export let stateOfSignedIn = derived<any, ISignedInState>([
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
