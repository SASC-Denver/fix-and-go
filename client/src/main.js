import App from './App.svelte'

import './assets/styles/global.css'
import './assets/styles/fix-and-go.css'

import {bootstrap} from '@fix-and-go/logic'

document.addEventListener('DOMContentLoaded', function () {
	try {
		const context = window
		

		context.app = new App({target: document.body})
	} catch (e) {
		console.error(e)
	}
})


