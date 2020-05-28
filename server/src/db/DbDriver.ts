import * as sqlite3 from 'sqlite3'

export let db

export function closeDb() {
	db.close()
}

export function startDb() {
	// db = new sqlite3.verbose().Database(':memory:');
	db = new sqlite3.Database('../../../fix-n-go.sqlite3')
	// db = new sqlite3.Database('test.db');
}

export function find<Row>(
	query: string,
	...parameters: any[]
): Promise<Row[]> {
	return new Promise((
		resolve,
		reject
	) => {
		db.all(query, ...parameters, (
			err,
			rows
		) => {
			if (err) {
				reject(err)
				return
			}
			resolve(rows as Row[])
		})
	})
}

export function run(
	query: string,
	...parameters: any[]
): Promise<void> {
	return new Promise((
		resolve,
		reject
	) => {
		// console.log('running query:')
		// console.log(query)
		// console.log('with parameters:')
		// console.log(JSON.stringify(parameters))
		db.run(query, ...parameters, (
			err
		) => {
			if (err) {
				console.log('Error:')
				console.log(err)
				reject(err)
				return
			}
			resolve()
		})
	})
}
