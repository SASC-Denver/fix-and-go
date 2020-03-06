import { Readable } from 'svelte/store';
export declare type Id = number;
export declare type User_Id = Id;
export declare type User_Name = string;
export declare type Timestamp_Milliseconds = number;
export declare type Timestamp_TimezoneOffset = number;
export declare type Timestamp_Server = any;
export declare type Timestamp_Timezone = string;
export declare type Screen_Path = string;
export declare type Screen_Authenticated = boolean;
export declare type Screen_RightMenu = boolean;
export declare type Route_ParamValue = string;
export interface ITimestamp {
    m: Timestamp_Milliseconds;
    o: Timestamp_TimezoneOffset;
    s: Timestamp_Server;
    z: Timestamp_Timezone;
}
export interface IUser extends IIdentified<User_Id> {
    name: User_Name;
}
export interface IUserCreated<K extends Id> extends IIdentified<K> {
    createdAt: ITimestamp;
    userId: User_Id;
}
export interface IIdentified<K extends Id> {
    id: K;
}
export interface IScreenConfig {
    authenticated: Screen_Authenticated;
    key: Screen_Path;
    rightMenu: Screen_RightMenu;
}
export interface ITextToast {
    seconds: number;
    text: string;
    time: number;
}
export interface IToggleStore extends Readable<boolean> {
    toggle(): void;
}
export interface ITextToastStore extends Readable<ITextToast> {
    toggle(newText: string, seconds?: number): void;
}
export interface ISignedInStateChanged {
    authChecked: boolean;
    showSignIn: boolean;
    user: boolean;
}
export interface ISignedInStateCurrent {
    authChecked: boolean;
    showSignIn: boolean;
    user: IUser;
}
export interface ISignedInState {
    changed: ISignedInStateChanged;
    current: ISignedInStateCurrent;
}
export declare let stateOfAuthChecked: import("svelte/store").Writable<boolean>;
export declare let stateOfCurrentScreen: import("svelte/store").Writable<IScreenConfig>;
export declare let stateOfMode: import("svelte/store").Writable<string>;
export declare let stateOfPageTitle: import("svelte/store").Writable<string>;
export declare let stateOfPopup: import("svelte/store").Writable<boolean>;
export declare let stateOfShowConfirm: import("svelte/store").Writable<boolean>;
export declare let stateOfShowMainMenu: IToggleStore;
export declare let stateOfShowSignIn: import("svelte/store").Writable<boolean>;
export declare let stateOfText: import("svelte/store").Writable<{}>;
export declare let stateOfTextToast: ITextToastStore;
export declare const stateOfTopMenuShown: IToggleStore;
export declare let stateOfUser: import("svelte/store").Writable<IUser>;
export declare let stateOfShowTopMenu: Readable<boolean>;
export declare let stateOfSignedIn: Readable<ISignedInState>;
