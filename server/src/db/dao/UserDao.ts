import {IGamePlayerAttributes} from '@fix-and-go/logic'
import {
	find,
	run
}                              from '../DbDriver'
import {IUser}                 from '../model/User'
import {IDao}                  from './Dao'

export class UserDao
	implements IDao {

	async createTable() {
		// console.log('Creating table "users"')
		await run(`
CREATE  TABLE IF NOT EXISTS users (
  user_id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username         VARCHAR(20)                       NOT NULL UNIQUE,
  encoded_email    VARCHAR(90)                       NOT NULL UNIQUE,
  encoded_password VARCHAR(90)                       NOT NULL,
  attributes       TEXT                              NOT NULL
);`)
		// console.log('Creating unique index "users.username"')
		await run(`
CREATE UNIQUE INDEX IF NOT EXISTS users_username_uidx
	ON users (username ASC);`)
		// console.log('Creating unique index "users.encoded_email"')
		await run(`
CREATE UNIQUE INDEX IF NOT EXISTS users_encoded_email_uidx
	ON users (encoded_email ASC);`)
		// console.log('Done creating "users"')
	}

	async createUser(
		username: string,
		encodedEmail: string,
		encodedPassword: string,
		attributes: IGamePlayerAttributes,
	): Promise<IUser> {
		const existingUsers = await this.findByUsernameOrEncodedEmail(
			username, encodedEmail)

		if (existingUsers.length) {
			// console.log(JSON.stringify(existingUsers))
			if (existingUsers[0].username === username) {
				throw new Error('Username already taken')
			} else {
				throw new Error('E-mail already taken')
			}
		}

		await run(`
INSERT INTO users
  (username, encoded_email, encoded_password, attributes)
VALUES
  (?, ?, ?, ?)`, username, encodedEmail,
			encodedPassword, JSON.stringify(attributes))

		return await this.findByEncodedEmail(encodedEmail)
	}

	async findByUsernameOrEncodedEmail(
		username: string,
		encodedEmail: string
	): Promise<IUser[]> {
		return await find(`
SELECT
	user_id AS id,
	username,
	encoded_email as encodedEmail
FROM
	users
WHERE
	username = ?
	OR encoded_email = ?`, username, encodedEmail)
	}

	async findByEncodedEmail(
		encodedEmail: string
	): Promise<IUser> {
		const records: any[] = await find(`
SELECT
	user_id       AS id,
	username,
	encoded_email    AS encodedEmail,
	encoded_password AS encodedPassword,
	attributes
FROM
	users
WHERE
	encoded_email = ?`, encodedEmail)

		console.log(JSON.stringify(records, null, 2))
		if (records && records.length) {
			// console.log(JSON.stringify(records, null, 2))
			records[0].attributes = JSON.parse(records[0].attributes)

			return records[0] as IUser
		}

		return null
	}

}
