export interface IApp {
}
export interface IAppOptions {
    target: HTMLElement;
}
export interface IAppConstructor {
    new (options: IAppOptions): IApp;
}
export declare function bootstrap(AppConstructor: IAppConstructor): Promise<void>;
