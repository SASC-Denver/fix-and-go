// Require the framework and instantiate it
import {
	ErrorCode,
	GamePlayer,
	IChatRequest,
	IChatSecondUpdateResponse,
	IGamePlayerAttributes,
	IMoveRequest,
	ISignInRequest,
	IZoneUpdate,
	IZoneUpdates,
	testZoneAttributes,
	Zone
}                      from '@fix-and-go/logic'
import * as fastifyLib from 'fastify'

const fastify = fastifyLib({logger: false})

fastify.register(require('fastify-cors'), {
	origin: (
		origin,
		cb
	) => {
		if (!origin || /localhost/.test(origin) ||
			/86297555dce54909ab4c30f21c2e3db7.vfs.cloud9.us-east-2.amazonaws.com/.test(origin)) {
			// Request from localhost or Cloud9 development server will pass 
			cb(null, true)
			return
		}
		cb(new Error('Not allowed CORS host'), false)
	}
})

const players: {
	[id: number]: GamePlayer
} = {}

let testZone: Zone

let updates: IZoneUpdates = {}

let lastMessageId = 0

let currentSecond                             = 0
const recentChat: IChatSecondUpdateResponse[] = [{
	messages: [],
	second: currentSecond,
}]

initGame()

function initGame(): void {
	testZone = new Zone()
	testZone.initFromAttributes(testZoneAttributes)
}

// Declare a route
fastify.get('/api/hello', async (
	request,
	reply
) => {
	return {hello: 'world'}
})

// Declare a route
fastify.put('/api/signIn', async (
	request,
	reply
) => {
	const signInRequest: ISignInRequest = request.body

	const id                                      = ++Zone.lastObjectId
	const playerAttributes: IGamePlayerAttributes = {
		coordinates: {
			x: 5,
			y: 4,
		},
		id,
		maxHealth: 15,
		maxMagic: 10,
		username: signInRequest.username
	}

	const newPlayer = new GamePlayer(playerAttributes)

	console.log('New player id: ' + id)
	players[id] = newPlayer

	ADD_PLAYER_TO_ZONE:
		for (let x = playerAttributes.coordinates.x; x < testZone.dimensions.x; x++) {
			for (let y = playerAttributes.coordinates.y; y < testZone.dimensions.y; y++) {
				playerAttributes.coordinates = {
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
fastify.put('/api/chat', async (
	request,
	reply
) => {
	const data: IChatRequest = request.body
	// console.log(data)

	if (typeof data.playerId !== 'number'
		|| typeof data.text !== 'string'
		|| !players[data.playerId]) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid request'
			}
		}
	}
	const player = players[data.playerId]

	recentChat[recentChat.length - 1].messages.push({
		id: ++lastMessageId,
		text: data.text,
		username: player.attributes.username
	})

	return {}
})

// Declare a route
fastify.put('/api/move', async (
	request,
	reply
) => {
	const data: IMoveRequest = request.body
	// console.log(data)

	if (typeof data !== 'object') {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid request'
			}
		}
	}
	// console.log('data.playerId: ' + data.playerId + ', ' + (typeof data.playerId !== 'number'))

	if (typeof data.playerId !== 'number'
		|| !players[data.playerId]) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid player Id'
			}
		}
	}

	const player = players[data.playerId]
	if (player.lastSecondOf.move === currentSecond) {
		return {
			error: {
				code: ErrorCode.REQUESTING_TOO_FREQUENTLY,
				description: 'Moving too quickly'
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

	const newX = player.attributes.coordinates.x + changeInX
	const newY = player.attributes.coordinates.y + changeInY

	if (!testZone.moveObject(player, newX, newY)) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid move'
			}
		}
	}

	player.lastSecondOf.move = currentSecond

	return {
		newCoords: player.attributes.coordinates
	}
})

// Declare a route
fastify.get('/api/updates', async (
	request,
	reply
) => {
	const lastUpdateSecond = parseInt(request.query.lastUpdateSecond)
	const playerId         = parseInt(request.query.playerId)
	// tslint:disable-next-line:use-isnan
	if (playerId === NaN || lastUpdateSecond === NaN) {
		return {
			error: {
				code: ErrorCode.INVALID_REQUEST,
				description: 'Invalid "Get Updates" input'
			}
		}
	}

	const chat = recentChat.filter(messagesForSecond => messagesForSecond.second >= lastUpdateSecond)

	// console.log('playerId: ' + playerId)
	const updatesForPlayer = updates[playerId]
	return {
		chat,
		currentSecond,
		zone: {
			dimensions: testZone.dimensions,
			updates: updatesForPlayer ? updatesForPlayer : []
		}
	}
})

// Run the server!
const start = async () => {
	try {
		await fastify.listen(8081)
		fastify.log.info(`server listening on ${(fastify.server as any).address().port}`)
		trackTime()
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()

function trackTime() {
	updates = {}

	for (const playerId in players) {
		const player                       = players[playerId]
		player.visionRange                 = {
			high: {
				x: player.attributes.coordinates.x + 5,
				y: player.attributes.coordinates.y + 5
			},
			low: {
				x: player.attributes.coordinates.x - 5,
				y: player.attributes.coordinates.y - 5
			}
		}
		// console.log(player.visionRange)
		const playerUpdates: IZoneUpdate[] = []
		updates[player.attributes.id]      = playerUpdates
		for (const objectType in testZone.objectsDirectory) {
			// console.log('objectType:' + objectType)
			const directoryForType = testZone.objectsDirectory[objectType]
			for (const id in directoryForType) {
				const object      = directoryForType[id]
				const coordinates = object.attributes.coordinates
				// console.log('id:' + id + ', x: ' + coordinates.x + ', y: ' + coordinates.y)
				if (coordinates.x >= player.visionRange.low.x
					&& coordinates.x <= player.visionRange.high.x
					&& coordinates.y >= player.visionRange.low.y
					&& coordinates.y <= player.visionRange.high.y) {
					// console.log('in range')
					playerUpdates.push(object.attributes)
				}
			}
		}
	}

	while (recentChat.length > 5) {
		recentChat.shift()
	}

	const currentMillisecond = new Date().getTime()
	currentSecond            = Math.floor(currentMillisecond / 1000)
	const secondRemainder    = new Date().getTime() % 1000

	recentChat.push({
		messages: [],
		second: currentSecond,
	})

	setTimeout(trackTime, 1000 - secondRemainder)
}
