// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

export interface IApp {
}

export interface IAppOptions {

	target: HTMLElement

}

export interface IAppConstructor {

	new(options: IAppOptions): IApp

}

export async function bootstrap(
	AppConstructor: IAppConstructor
) {
	try {
		const firebaseConfig = {
			apiKey: 'AIzaSyCmNKXSDq9-28u-4Gdofk_8NHgShaAy_g8',
			appId: '1:1016948907526:web:12abbf780e82e781d8ad87',
			authDomain: 'fix-and-go.firebaseapp.com',
			databaseURL: 'https://fix-and-go.firebaseio.com',
			measurementId: 'G-G0MM78G8GY',
			messagingSenderId: '1016948907526',
			projectId: 'fix-and-go',
			storageBucket: 'fix-and-go.appspot.com'
		}

		const context = window as any

		context.fb  = firebase.initializeApp(firebaseConfig)
		context.db  = firebase.database()
		context.app = new AppConstructor({
			target: document.body
		})
	} catch (e) {
		console.error(e)
	}
}
