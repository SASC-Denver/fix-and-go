"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Firebase App (the core Firebase SDK) is always required and must be listed first
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
async function bootstrap(AppConstructor) {
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
        };
        const context = window;
        context.fb = firebase.initializeApp(firebaseConfig);
        context.db = firebase.database();
        context.app = new AppConstructor({
            target: document.body
        });
    }
    catch (e) {
        console.error(e);
    }
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map