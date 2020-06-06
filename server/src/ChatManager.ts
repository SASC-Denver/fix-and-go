import {
	error,
	GamePlayer,
	IChatRequest,
	IChatSecondUpdateResponse,
	IResponse
}                        from '@fix-and-go/logic'
import {AbstractManager} from './AbstractManager'
import {Coordinator}     from './Coordinator'

export class ChatManager
	extends AbstractManager {

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
		return this.playerSafe(data, (
			player: GamePlayer
		) => {
			const players = this.coordinator.playerManager.players
			if (typeof data.text !== 'string') {
				return error('Invalid request')
			}

			this.recentChat[this.recentChat.length - 1].messages.push({
				id: ++this.lastMessageId,
				text: data.text,
				username: player.state.attributes.username
			})

			return {}
		})
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
