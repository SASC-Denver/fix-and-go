// Require the framework and instantiate it
import {
	ErrorCode,
	GamePlayer,
	IGamePlayerAttributes,
	IMoveRequest,
	ISignInRequest,
	testZoneAttributes,
	Zone
} from '@fix-and-go/logic'
import * as fastifyLib from 'fastify'

const fastify = fastifyLib({logger: true})

fastify.register(require('fastify-cors'), {
	origin: (
		origin,
		cb
	) => {
		if (/localhost/.test(origin)) {
			//  Request from localhost will pass
			cb(null, true)
			return
		}
		cb(new Error('Not allowed'), false)
	}
})

const players: GamePlayer[] = []

let testZone

initGame()

function initGame(): void {
	testZone = new Zone(testZoneAttributes)
}

// Declare a route
fastify.put('/signIn', async (
	request,
	reply
) => {
	const signInRequest: ISignInRequest = request.body

	const id = players.length

	const playerAttributes: IGamePlayerAttributes = {
		id,
		maxHealth: 15,
		maxMagic: 10,
		startCoords: {
			x: 5,
			y: 4,
		},
		username: signInRequest.username
	}

	const newPlayer = new GamePlayer(playerAttributes)

	players.push(newPlayer)

	ADD_PLAYER_TO_ZONE:
		for (let x = playerAttributes.startCoords.x; x < testZone.dimensions.x; x++) {
			for (let y = playerAttributes.startCoords.y; y < testZone.dimensions.y; y++) {
				playerAttributes.startCoords.x = x
				playerAttributes.startCoords.y = y
				newPlayer.coordinates          = {
					x,
					y
				}
				if (testZone.add(newPlayer)) {
					break ADD_PLAYER_TO_ZONE
				}
			}
		}

	return playerAttributes
})

// Declare a route
fastify.put('/move', async (
	request,
	reply
) => {
	const data: IMoveRequest = request.body

	if (typeof data !== 'object') {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid request'
			}
		}
	}

	if (typeof data.playerId !== 'number'
		|| data.playerId < 0
		|| data.playerId >= players.length) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid player Id'
			}
		}
	}

	if (typeof data.positionChange !== 'object'
		|| typeof data.positionChange.x !== 'number'
		|| typeof data.positionChange.y !== 'number') {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid move to coordinates'
			}
		}
	}

	const changeInX = data.positionChange.x
	const changeInY = data.positionChange.y

	if (changeInX < -1 || changeInX > 1) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid X coordinate change'
			}
		}
	}

	if (changeInX < -1 || changeInX > 1) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid Y coordinate change'
			}
		}
	}

	if (changeInX === 0 && changeInY === 0) {
		// That's where the Player is
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'No move needed'
			}
		}
	}

	const player = players[data.playerId]
	const newX   = player.coordinates.x + changeInX
	const newY   = player.coordinates.y + changeInY

	if (!testZone.moveObject(player, newX, newY)) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid move'
			}
		}
	}

	return {
		newCoords: player.coordinates
	}
})

// Run the server!
const start = async () => {
	try {
		await fastify.listen(8080)
		fastify.log.info(`server listening on ${(fastify.server as any).address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()
