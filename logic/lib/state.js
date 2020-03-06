"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("svelte/store");
function createShowMainMenu() {
    const store = store_1.writable(false);
    return {
        subscribe: store.subscribe,
        toggle: () => store.set(!store_1.get(store))
    };
}
function createTopMenuShown() {
    const store = store_1.writable(false);
    return {
        subscribe: store.subscribe,
        toggle: () => store.set(!store_1.get(store))
    };
}
function createTextToast() {
    const { set, subscribe } = store_1.writable({
        seconds: 0,
        text: '',
        time: null
    });
    return {
        subscribe,
        toggle: (newText, seconds = 3) => {
            set({
                seconds,
                text: newText,
                time: new Date().getTime()
            });
        }
    };
}
exports.stateOfAuthChecked = store_1.writable(false);
exports.stateOfCurrentScreen = store_1.writable(null);
exports.stateOfMode = store_1.writable(null);
exports.stateOfPageTitle = store_1.writable('Votecube');
exports.stateOfPopup = store_1.writable(false);
exports.stateOfShowConfirm = store_1.writable(false);
exports.stateOfShowMainMenu = createShowMainMenu();
exports.stateOfShowSignIn = store_1.writable(false);
exports.stateOfText = store_1.writable({});
exports.stateOfTextToast = createTextToast();
exports.stateOfTopMenuShown = createTopMenuShown();
exports.stateOfUser = store_1.writable(null);
exports.stateOfShowTopMenu = store_1.derived([
    exports.stateOfShowMainMenu,
    exports.stateOfTopMenuShown
], ([$showMainMenu, $topMenuShown]) => !$showMainMenu && $topMenuShown);
let lastSignedInState = {
    authChecked: false,
    showSignIn: false,
    user: null
};
exports.stateOfSignedIn = store_1.derived([
    exports.stateOfAuthChecked,
    exports.stateOfShowSignIn,
    exports.stateOfUser
], ([$authChecked, $showSignIn, $user]) => {
    const changed = {
        authChecked: $authChecked !== lastSignedInState.authChecked,
        showSignIn: $showSignIn !== lastSignedInState.showSignIn,
        user: $user !== lastSignedInState.user
    };
    lastSignedInState = {
        authChecked: $authChecked,
        showSignIn: $showSignIn,
        user: $user
    };
    return {
        changed,
        current: lastSignedInState
    };
});
//# sourceMappingURL=state.js.map