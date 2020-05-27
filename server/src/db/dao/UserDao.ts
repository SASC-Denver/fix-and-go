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
  user_id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username      VARCHAR(20)                   NOT NULL UNIQUE,
  email_hash    VARCHAR(90)                  NOT NULL UNIQUE,
  password_hash VARCHAR(90)                  NOT NULL,
  attributes    TEXT                          NOT NULL
);`)
		// console.log('Creating unique index "users.username"')
		await run(`
CREATE UNIQUE INDEX IF NOT EXISTS users_username_uidx
	ON users (username ASC);`)
		// console.log('Creating unique index "users.email_hash"')
		await run(`
CREATE UNIQUE INDEX IF NOT EXISTS users_email_hash_uidx
	ON users (email_hash ASC);`)
		// console.log('Done creating "users"')
	}

	async createUser(
		username: string,
		emailHash: string,
		passwordHash: string,
		attributes: IGamePlayerAttributes,
	): Promise<IUser> {
		const existingUsers = await this.findByUsernameOrEmailHash(username, emailHash)

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
  (username, email_hash, password_hash, attributes)
VALUES
  (?, ?, ?, ?)`, username, emailHash, passwordHash, JSON.stringify(attributes))

		return await this.findByEmailHash(emailHash)
	}

	async findByUsernameOrEmailHash(
		username: string,
		emailHash: string
	): Promise<IUser[]> {
		return await find(`
SELECT
	user_id AS id,
	username,
	email_hash as emailHash
FROM
	users
WHERE
	username = ?
	OR email_hash = ?`, username, emailHash)
	}

	async findByEmailHash(
		emailHash: string
	): Promise<IUser> {
		const records: any[] = await find(`
SELECT
	user_id       AS id,
	username,
	email_hash    AS emailHash,
	password_hash AS passwordHash,
	attributes
FROM
	users
WHERE
	email_hash = ?`, emailHash)

		if (records && records.length) {
			// console.log(JSON.stringify(records, null, 2))
			records[0].attributes = JSON.parse(records[0].attributes)

			return records[0] as IUser
		}

		return null
	}

}
