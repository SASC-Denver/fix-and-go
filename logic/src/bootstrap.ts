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
		const context = window as any

		context.app = new AppConstructor({
			target: document.body
		})
	} catch (e) {
		console.error(e)
	}
}
