import {
	error,
	IChatRequest,
	IChatSecondUpdateResponse,
	IResponse
}                    from '@fix-and-go/logic'
import {Coordinator} from './Coordinator'

export class ChatManager {

	lastMessageId                           = 0
	recentChat: IChatSecondUpdateResponse[] = []
	theCoordinator: Coordinator

	get coordinator(): Coordinator {
		return this.theCoordinator
	}

	set coordinator(
		coordinator: Coordinator
	) {
		this.recentChat     = [{
			messages: [],
			second: coordinator.currentSecond,
		}]
		this.theCoordinator = coordinator
	}

	chat(
		data: IChatRequest
	): IResponse {
		// console.log(data)

		const players = this.coordinator.playerManager.players
		if (typeof data.playerId !== 'number'
			|| typeof data.text !== 'string'
			|| !players[data.playerId]) {
			return error('Invalid request')
		}
		const player = players[data.playerId]

		this.recentChat[this.recentChat.length - 1].messages.push({
			id: ++this.lastMessageId,
			text: data.text,
			username: player.attributes.username
		})

		return {}
	}

	update(): void {
		while (this.recentChat.length > 5) {
			this.recentChat.shift()
		}
		this.recentChat.push({
			messages: [],
			second: this.coordinator.currentSecond,
		})
	}

}
