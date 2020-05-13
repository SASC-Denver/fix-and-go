export interface IApp {
t


}

export interface IAppOptions {

	target: HTMLElement

}

export interface IAppConstructor {

	new(options: IAppOptions): IApp

}

export function bootstrap(
	AppConstructor: IAppConstructor
) {
	try {
		const context = window as any
		

		context.app = new AppConstructor({target: document.body})
	} catch (e) {
		console.error(e)
	}
}
