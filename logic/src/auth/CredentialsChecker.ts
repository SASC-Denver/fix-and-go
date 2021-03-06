import {errorObject} from '..'
import {
	ErrorCode,
	IResponseError
}                    from '../model/network/data'

export class CredentialsChecker {

	checkSignInCredentials(
		email: string,
		password: string
	): IResponseError {
		let errorText = this.validateEmail(email)
		if (errorText) {
			return errorObject(errorText)
		}
		errorText = this.validatePassword(password)
		if (errorText) {
			return errorObject(errorText)
		}
		return null
	}

	serverCheckCredentials(
		username: string,
		encodedEmail: string,
		encodedPassword: string
	): IResponseError {
		const errorText = this.validateUsername(username)
		if (errorText) {
			return errorObject(errorText)
		}

		if (typeof encodedEmail !== 'string'
			|| encodedEmail.length !== 88) {
			return errorObject('Invalid email')
		}

		if (typeof encodedPassword !== 'string'
			|| encodedPassword.length !== 88) {
			return errorObject('Invalid password')
		}

		return null
	}

	checkSignUpCredentials(
		username: string,
		email: string,
		password: string
	): IResponseError {
		let errorText = this.validateUsername(username)
		if (errorText) {
			return errorObject(errorText)
		}
		errorText = this.validateEmail(email)
		if (errorText) {
			return errorObject(errorText)
		}
		errorText = this.validatePassword(password)
		if (errorText) {
			return errorObject(errorText)
		}
		return null
	}

	checkResetPasswordCredentials(
		email: string,
	): IResponseError {
		const errorText = this.validateEmail(email)
		if (errorText) {
			return errorObject(errorText)
		}
		return null
	}

	validateEmail(
		email: string
	): string {
		if (!email) {
			return 'Please enter an e-mail'
		}

		const regex        = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
		const isEmailValid = regex.test(email)
		if (!isEmailValid) {
			return 'Please enter a valid e-mail'
		}

		return null
	}

	validatePassword(
		password: string
	): string {
		if (!password) {
			return 'Please enter a password'
		}

		/*
										^.*              : Start
						(?=.{8,})        : Length
						(?=.*[a-zA-Z])   : Letters
						(?=.*\d)         : Digits
						(?=.*[!#$%&?]) : Special characters
										.*$              : End
		 */
		// const regex           = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?]).*$/
		const regex           = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/
		const isPasswordValid = regex.test(password)
		if (!isPasswordValid) {
			// return 'Password must be at least 8 characters long, with at least one number and one of !#$%&?'
			return 'Password must be at least 8 characters long, with at least one number'
		}

		return null
	}

	validateUsername(
		username: string
	): string {
		if (!username) {
			return 'Please enter a username'
		}

		if (username.length < 3) {
			return 'Username must be at least 3 characters long'
		}

		if (username.length > 12) {
			return 'Username cannot be more than 12 characters long'
		}

		return null
	}

}
