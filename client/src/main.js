import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch'


import App from './App.svelte'

import './assets/styles/global.css'
import './assets/styles/fix-and-go.css'

document.addEventListener('DOMContentLoaded', function () {
    try {
        const context = window


        context.app = new App({target: document.body})
    } catch (e) {
        console.error(e)
    }
})


