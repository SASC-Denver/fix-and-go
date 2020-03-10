// Require the framework and instantiate it
import * as fastifyLib from 'fastify'

const fastify = fastifyLib({logger: true})

// Declare a route
fastify.get('/', async (request, reply) => {
	return { hello: 'world' }
})

// Run the server!
const start = async () => {
	try {
		await fastify.listen(3000)
		fastify.log.info(`server listening on ${(fastify.server as any).address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()
