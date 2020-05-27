import * as fastifyLib from 'fastify'
import {ChatManager}   from './ChatManager'
import {Coordinator}   from './Coordinator'
import {
	closeDb,
	startDb
}                      from './db/DbDriver'
import {PlayerManager} from './PlayerManager'
import {ZoneManager}   from './ZoneManager'

const fastify = fastifyLib({logger: false})
let chatManager: ChatManager
let coordinator: Coordinator
let playerManager: PlayerManager
let zoneManager: ZoneManager

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

// Declare a route
fastify.get('/api/hello', async (
	request,
	reply
) => {
	return {hello: 'world'}
})

// Declare a route
fastify.put('/api/signUp', async (
	request,
	reply
) => {
	return await playerManager.signUp(request.body)
})

// Declare a route
fastify.put('/api/signIn', async (
	request,
	reply
) => {
	return await playerManager.signIn(request.body)
})

// Declare a route
fastify.put('/api/resetPassword', async (
	request,
	reply
) => {
	return await playerManager.resetPassword(request.body)
})

// Declare a route
fastify.put('/api/chat', async (
	request,
	reply
) => {
	return chatManager.chat(request.body)
})

// Declare a route
fastify.put('/api/move', async (
	request,
	reply
) => {
	return zoneManager.move(request.body)
})

// Declare a route
fastify.get('/api/updates', async (
	request,
	reply
) => {
	return coordinator.getUpdates(request.query as any)
})

function initGame(): void {
	chatManager               = new ChatManager()
	zoneManager               = new ZoneManager()
	playerManager             = new PlayerManager()
	coordinator               = new Coordinator(chatManager, playerManager, zoneManager)
	chatManager.coordinator   = coordinator
	playerManager.coordinator = coordinator
	zoneManager.coordinator   = coordinator
}

// Run the server!
const start = async () => {
	try {
		initGame()
		startDb()
		await playerManager.userDao.createTable()
		await fastify.listen(8081)
		fastify.log.info(`server listening on ${(fastify.server as any).address().port}`)
		coordinator.trackTime()
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

// process.on('exit', () => {
// 	console.log('About to exit, waiting for remaining connections to complete')
// 	// app.close();
// })

process.on('SIGINT', () => {
	console.log('Caught interrupt signal')
	closeDb()
	console.log('Database closed.')
	process.exit()
})

start()
