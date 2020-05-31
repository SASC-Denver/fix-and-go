import * as fastifyLib from 'fastify'
import {ChatManager}   from './ChatManager'
import {Coordinator}   from './Coordinator'
import {
	closeDb,
	startDb
}                      from './db/DbDriver'
import {PlayerManager} from './PlayerManager'
import {TradeManager}  from './TradeManager'
import {ZoneManager}   from './ZoneManager'

const fastify = fastifyLib({logger: false})
let chatManager: ChatManager
let coordinator: Coordinator
let playerManager: PlayerManager
let tradeManager: TradeManager
let zoneManager: ZoneManager

fastify.register(require('fastify-cors'), {
	origin: (
		origin,
		cb
	) => {
		// console.log('Origin: ' + origin)
		if (!origin || /206\.189\.196\.29/.test(origin) || /localhost/.test(origin) ||
			/86297555dce54909ab4c30f21c2e3db7.vfs.cloud9.us-east-2.amazonaws.com/.test(origin)) {
			// Request from localhost or Cloud9 development server will pass 
			cb(null, true)
			return
		}
		cb(new Error('Not allowed CORS host'), false)
	}
})

const path = require('path')
fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'public'),
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

fastify.get('/api/getInventory', async (
	request,
	reply
) => {
	return playerManager.getInventory(request.query as any)
})

fastify.get('/api/inspectZoneItems', async (
	request,
	reply
) => {
	return zoneManager.inspectZoneItems(request.query as any)
})

// Declare a route
fastify.put('/api/pickUpZoneItem', async (
	request,
	reply
) => {
	return zoneManager.pickUpZoneItem(request.body)
})

// Declare a route
fastify.put('/api/dropItemToZone', async (
	request,
	reply
) => {
	return zoneManager.dropItemToZone(request.body)
})

fastify.put('/api/tradeDealStart', async (
	request,
	reply
) => {
	// Player initiated a trade (with another player or store).
	return tradeManager.tradeDealStart(request.body)
})

fastify.put('/api/tradeDealReply', async (
	request,
	reply
) => {
	// Player replied to initial trade deal request (yes/now).
	return tradeManager.tradeDealReply(request.body)
})

fastify.put('/api/tradeDealChange', async (
	request,
	reply
) => {
	// Player changed terms of the trade.
	return tradeManager.tradeDealChange(request.body)
})

fastify.put('/api/tradeDealCancel', async (
	request,
	reply
) => {
	// Player cancelled the trade.
	return tradeManager.tradeDealCancel(request.body)
})

fastify.put('/api/tradeDealCommit', async (
	request,
	reply
) => {
	// Player committed to the trade.
	return tradeManager.tradeDealCommit(request.body)
})

function initGame(): void {
	chatManager               = new ChatManager()
	playerManager             = new PlayerManager()
	tradeManager              = new TradeManager()
	zoneManager               = new ZoneManager()
	coordinator               = new Coordinator(
		chatManager, playerManager, tradeManager, zoneManager)
	chatManager.coordinator   = coordinator
	playerManager.coordinator = coordinator
	tradeManager.coordinator  = coordinator
	zoneManager.coordinator   = coordinator
}

// Run the server!
const start = async () => {
	try {
		initGame()
		startDb()
		await playerManager.userDao.createTable()
		await fastify.listen(8081, '0.0.0.0')
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
